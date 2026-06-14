# Explicación: Búsqueda Semántica en el RAG
## Ejemplo práctico con la consulta "Mantenimientos Verado V12"

---

## 1. Chunking: preparar el documento antes de indexar

Antes de que existan vectores, el documento se trocea en chunks. Con tu configuración (chunk size 512, overlap 100):

```
DOCUMENTO ORIGINAL (texto plano)
═══════════════════════════════════════════════════════════════

  "...El motor Verado V12 requiere cambio de aceite cada 100 horas.
  Usar aceite Mercury 25W-40. Revisar filtro de combustible cada
  200 horas. Inspeccionar ánodos cada 50 horas de operación..."


CHUNKING (chunk size 512 chars, overlap 100 chars)
═══════════════════════════════════════════════════════════════

  ┌─────────────────────────────────────────────────────────┐
  │ CHUNK 1 (512 chars)                                     │
  │ "El motor Verado V12 requiere cambio de aceite cada     │
  │  100 horas. Usar aceite Mercury 25W-40. Revisar filtro  │
  │  de combustible cada 200 horas..."                      │
  └─────────────────────────────────────────────────────────┘
                                    ↕ 100 chars se repiten
  ┌─────────────────────────────────────────────────────────┐
  │ CHUNK 2 (512 chars)                                     │
  │ "...Revisar filtro de combustible cada 200 horas.       │  ← overlap
  │  Inspeccionar ánodos cada 50 horas de operación.        │
  │  Cambiar impeler cada 300 horas..."                     │
  └─────────────────────────────────────────────────────────┘
                                    ↕ 100 chars se repiten
  ┌─────────────────────────────────────────────────────────┐
  │ CHUNK 3 (512 chars)                                     │
  │ "...Cambiar impeler cada 300 horas. Verificar correa    │  ← overlap
  │  de distribución..."                                    │
  └─────────────────────────────────────────────────────────┘
```

El overlap existe porque una idea importante puede quedar cortada justo en el borde entre dos chunks. Sin overlap, esa idea aparece partida en dos vectores distintos y ninguno la representa bien. Con 100 chars de overlap, el contexto frontera se repite en ambos chunks y los dos vectores la capturan. El coste es que algunos fragmentos están duplicados parcialmente en ChromaDB.

Después del chunking, cada chunk se embede por separado y se guarda en ChromaDB:

```
  chunk 1  ──►  [0.023, -0.415, 0.891, ...]  → ChromaDB
  chunk 2  ──►  [0.019, -0.401, 0.876, ...]  → ChromaDB
  chunk 3  ──►  [0.041, -0.388, 0.901, ...]  → ChromaDB
```

---

## 2. Qué es un vector

Cuando el modelo de embeddings procesa un chunk de texto, lo convierte en una lista de números llamada **vector**. Cada chunk queda representado por ~768 números:

```
chunk: "Cambiar aceite motor Verado V12 cada 100 horas"
vector: [0.023, -0.415, 0.891, ..., -0.234]  ← 768 números
          dim1   dim2   dim3        dim768
```

Cada número es una **coordenada** que determina hacia dónde "apunta" ese chunk en el espacio vectorial. No tienen un significado humano directo, pero textos con significado similar producen vectores matemáticamente cercanos.

---

## 3. Dónde viven los vectores y el texto

ChromaDB guarda las dos cosas juntas por cada chunk:

```
ChromaDB (una fila por chunk)

  chunk_id: "abc123"
  ┌─────────────────────────────────────────────────┐
  │ texto:    "Cambiar aceite motor Verado V12       │  ← BM25 busca aquí
  │            cada 100 horas de operación..."       │
  ├─────────────────────────────────────────────────┤
  │ vector:   [0.023, -0.415, 0.891, ..., -0.234]   │  ← Semántica busca aquí
  ├─────────────────────────────────────────────────┤
  │ metadata: { fuente: "Verado V12.pdf", page: 47 }│
  └─────────────────────────────────────────────────┘
```

"Vector store" es el nombre popular, pero ChromaDB guarda el paquete completo: texto, vector y metadatos.

---

## 4. Qué es la similitud coseno

Los vectores son flechas en un espacio multidimensional. La **similitud coseno** mide el ángulo entre dos flechas:

```
VECTORES EN EL ESPACIO 2D (simplificado)

          ↑
     1.0  │        B [0.021, 0.887]
          │       ↗  "Service intervals V12"
     0.8  │      ↗
          │   ↗ ← ángulo ~5°
     0.6  │  ↗
          │↗ A [0.023, 0.891]  ← CONSULTA
     0.4  │  "Mantenimientos Verado V12"
          │
     0.2  │              ↗ C [0.541, 0.123]
          │             ↗   "Filtros 2-stroke"
     0.0  │────────────────────────────────────→
         0.0   0.2   0.4   0.6   0.8   1.0
```

El coseno no es un eje ni una posición — es la función matemática que convierte el ángulo en un score de similitud:

```
Ángulo    cos(ángulo)    Interpretación en RAG
───────   ───────────    ──────────────────────
   0°         1.0        idénticos
  30°         0.87       muy similares
  45°         0.71       bastante similares
  60°         0.50       algo relacionados
  90°         0.0        sin relación
 180°        -1.0        opuestos
```

ChromaDB devuelve **distancia coseno** = `1 - similitud`, por eso el score más **bajo** es el más relevante:

```
  A vs B:  ángulo ~5°   →  cos(5°)  = 0.99  →  distancia 0.01  ✓ relevante
  A vs C:  ángulo ~70°  →  cos(70°) = 0.34  →  distancia 0.66  ✗ irrelevante
```

---

## 5. Flujo completo de búsqueda

```
PASO 1 — CONSULTA DEL USUARIO
─────────────────────────────
Usuario escribe: "Mantenimientos Verado V12"
      │
      ▼

PASO 2 — EMBEDDING (texto → vector)
────────────────────────────────────
Modelo: nomic-embed-text (via Ollama)

"Mantenimientos Verado V12"  ──►  [0.023, -0.415, 0.891, ..., -0.234]
                                   ◄─────────── 768 números ──────────►
      │
      ▼

PASO 3 — BÚSQUEDA HÍBRIDA EN CHROMADB
──────────────────────────────────────
Se lanzan DOS búsquedas en paralelo:

┌─────────────────────────────┐    ┌─────────────────────────────┐
│   SEMÁNTICA (vectores)      │    │   KEYWORD (BM25)            │
│                             │    │                             │
│  Compara tu vector contra   │    │  Busca chunks que contengan │
│  todos los chunks indexados │    │  literalmente: "Verado",    │
│  midiendo similitud coseno  │    │  "V12", "mantenimientos"    │
└────────────┬────────────────┘    └──────────────┬──────────────┘
             │                                    │
             └──────────────┬─────────────────────┘
                            │
                            ▼

PASO 4 — FUSIÓN Y RANKING
──────────────────────────
ChromaDB combina ambos scores y ordena por relevancia

Rank  Distancia  Fuente                    Página
────  ─────────  ────────────────────────  ──────
 1     0.01      Mercury Verado V12.pdf     p.47
 2     0.08      Mercury Verado V12.pdf     p.48
 3     0.15      Mercury 400R Manual.pdf    p.12
 4     0.22      Mercury Verado V12.pdf     p.51
 ...  (hasta 15 resultados)
      │
      ▼

PASO 5 — FILTRADO DE CHUNKS
────────────────────────────
query_knowledge.py descarta chunks con menos de 150 caracteres
(portadas, índices, metadatos sueltos)

 ✓  chunk > 150 chars  →  pasa
 ✗  chunk < 150 chars  →  descartado
      │
      ▼

PASO 6 — CONTEXTO AL LLM
─────────────────────────
Los chunks que pasaron el filtro se inyectan en el prompt:

┌──────────────────────────────────────────────────────────┐
│ SYSTEM PROMPT                                            │
│  + [chunk 1: texto p.47 Mercury Verado V12]              │
│  + [chunk 2: texto p.48 Mercury Verado V12]              │
│  + [chunk 3: texto p.12 Mercury 400R Manual]             │
│  + ...                                                   │
└──────────────────────────────────────────────────────────┘
      │
      ▼

PASO 7 — RESPUESTA GENERADA
────────────────────────────
El LLM lee el contexto recuperado y responde al usuario
basándose en los manuales Mercury indexados en la KB
```

---

## 6. Por qué búsqueda híbrida (semántica + BM25)

Cada método compensa la debilidad del otro:

```
SEMÁNTICA                          BM25
─────────────────────────────      ──────────────────────────────
Trabaja con vectores (números)     Trabaja con texto plano

[0.023, -0.415, 0.891, ...]   vs   "cambiar aceite Verado V12
                                    cada 100 horas de operación"

Mide ángulos entre flechas         Cuenta apariciones de palabras

Encuentra "Service intervals       Encuentra "Verado V12" solo si
V12" aunque esté en inglés         esas palabras están literalmente
                                   en el chunk
```

Por eso en el system prompt se recomienda buscar en ambos idiomas:

```
ES: "intervalos mantenimiento Verado V12"
EN: "Verado V12 maintenance intervals"
```

La semántica cruza el idioma, la BM25 no — buscar en los dos idiomas maximiza el recall.

---

## 7. Resumen visual final

```
Flechas apuntando igual  →  ángulo pequeño  →  coseno alto  →  RELEVANTE
Flechas apuntando lejos  →  ángulo grande   →  coseno bajo  →  IRRELEVANTE
```

Los vectores viven en el espacio (las flechas). El coseno es la regla que mide el ángulo entre ellas para decidir qué chunk se parece más a la consulta.
