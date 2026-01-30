# -----------------------------------------
# 1. Cálculo del Consumo de Combustible
# -----------------------------------------

def calcular_consumo_combustible(velocidad_nudos: float, duracion_horas: float) -> float:
    """
    Calcula el consumo de combustible basado en la velocidad en nudos y la duración en horas.
    Supone un consumo de 1 litro por hora por cada nudo de velocidad.
    
    :param velocidad_nudos: velocidad en nudos
    :param duracion_horas: duración del viaje en horas
    :return: consumo total en litros
    """
    if velocidad_nudos < 0 or duracion_horas < 0:
        raise ValueError("La velocidad y la duración deben ser positivas.")
    
    consumo_por_nudo = 1  # Consumo en litros por nudo
    consumo_total = consumo_por_nudo * velocidad_nudos * duracion_horas
    return consumo_total


# -----------------------------------------
# 2. Conversión de Velocidades
# -----------------------------------------

def convertir_velocidad(velocidad: float, unidad_origen: str, unidad_destino: str) -> float:
    """
    Convierte una velocidad entre nudos, km/h y mph.
    
    :param velocidad: valor de la velocidad
    :param unidad_origen: unidad de origen ('nudos', 'km/h', 'mph')
    :param unidad_destino: unidad a la que se convertirá ('nudos', 'km/h', 'mph')
    :return: velocidad convertida a la unidad destino
    """
    conversiones = {
        ('nudos', 'km/h'): 1.852,
        ('nudos', 'mph'): 1.15078,
        ('km/h', 'nudos'): 1 / 1.852,
        ('km/h', 'mph'): 1 / 1.609,
        ('mph', 'nudos'): 1 / 1.15078,
        ('mph', 'km/h'): 1.609
    }

    if unidad_origen == unidad_destino:
        return velocidad
    return velocidad * conversiones.get((unidad_origen, unidad_destino), 1)


# -----------------------------------------
# 3. Cálculo del Tiempo de Viaje
# -----------------------------------------

def calcular_tiempo_viaje(velocidad_nudos: float, distancia_millas_nauticas: float) -> float:
    """
    Calcula el tiempo estimado de viaje dado la velocidad en nudos y la distancia en millas náuticas.
    
    :param velocidad_nudos: velocidad del barco en nudos
    :param distancia_millas_nauticas: distancia del viaje en millas náuticas
    :return: tiempo estimado en horas
    """
    if velocidad_nudos <= 0:
        raise ValueError("La velocidad debe ser mayor que cero.")
    return distancia_millas_nauticas / velocidad_nudos


# -----------------------------------------
# 4. Conversión de Distancias (Millas Náuticas a Kilómetros)
# -----------------------------------------

def convertir_distancia(distancia_millas_nauticas: float) -> float:
    """
    Convierte una distancia de millas náuticas a kilómetros.
    
    :param distancia_millas_nauticas: distancia en millas náuticas
    :return: distancia en kilómetros
    """
    return distancia_millas_nauticas * 1.852


# -----------------------------------------
# 5. Cálculo de Distancia entre dos Puntos Geográficos
# -----------------------------------------

from geopy.distance import geodesic

def calcular_distancia_puertos(coord1: tuple, coord2: tuple) -> float:
    """
    Calcula la distancia entre dos coordenadas geográficas (latitud, longitud).
    
    :param coord1: coordenadas (latitud, longitud) del primer puerto
    :param coord2: coordenadas (latitud, longitud) del segundo puerto
    :return: distancia entre los dos puertos en kilómetros
    """
    return geodesic(coord1, coord2).kilometers

# Coordenadas de los puertos
puerto_nueva_york = (40.7128, -74.0060)  # Coordenadas de Nueva York
puerto_los_angeles = (34.0522, -118.2437)  # Coordenadas de Los Ángeles
puerto_alicante = (38.3452, -0.4907)      # Coordenadas del Puerto de Alicante
puerto_malaga = (36.7202, -4.4200)        # Coordenadas del Puerto de Málaga

# Calcular distancias
distancia_nueva_york_los_angeles = calcular_distancia_puertos(puerto_nueva_york, puerto_los_angeles)
distancia_alicante_malaga = calcular_distancia_puertos(puerto_alicante, puerto_malaga)

# -----------------------------------------
# 6. Cálculo de la Velocidad Promedio en el Viaje
# -----------------------------------------

def calcular_velocidad_promedio(distancia_km: float, tiempo_horas: float) -> float:
    """
    Calcula la velocidad promedio a partir de la distancia recorrida en kilómetros y el tiempo de viaje en horas.
    
    :param distancia_km: distancia en kilómetros
    :param tiempo_horas: tiempo en horas
    :return: velocidad promedio en km/h
    """
    if tiempo_horas <= 0:
        raise ValueError("El tiempo debe ser mayor que cero.")
    return distancia_km / tiempo_horas


# -----------------------------------------
# 7. Cálculo de Consumo de Combustible con Distancia
# -----------------------------------------

def calcular_consumo_combustible_distancia(velocidad_nudos: float, distancia_millas_nauticas: float) -> float:
    """
    Calcula el consumo de combustible basado en la distancia recorrida en millas náuticas y la velocidad en nudos.
    Supone que el consumo es de 1 litro por milla náutica por cada nudo de velocidad.
    
    :param velocidad_nudos: velocidad del barco en nudos
    :param distancia_millas_nauticas: distancia en millas náuticas
    :return: consumo total en litros
    """
    consumo_por_milla = 1  # Consumo en litros por milla náutica
    consumo_total = consumo_por_milla * velocidad_nudos * distancia_millas_nauticas
    return consumo_total


# -----------------------------------------
# 8. Cálculo del Desplazamiento en el Mar (Efecto Corriente)
# -----------------------------------------

def calcular_efecto_corriente(velocidad_nudos: float, direccion_barco: float, direccion_corriente: float) -> tuple:
    """
    Ajusta la velocidad y dirección del barco considerando el efecto de una corriente marina.
    
    :param velocidad_nudos: velocidad del barco en nudos
    :param direccion_barco: dirección del barco en grados (0° a 360°)
    :param direccion_corriente: dirección de la corriente en grados (0° a 360°)
    :return: nueva velocidad en nudos y nueva dirección del barco
    """
    import math
    # Desviación angular debido a la corriente
    desviacion = math.degrees(math.atan2(math.sin(math.radians(direccion_corriente - direccion_barco)),
                                         math.cos(math.radians(direccion_corriente - direccion_barco))))
    # Ajuste de velocidad (suponiendo que la corriente reduce la velocidad en un 10%)
    nueva_velocidad = velocidad_nudos * 0.9  # Supongamos que la corriente reduce la velocidad en un 10%
    nueva_direccion = (direccion_barco + desviacion) % 360
    return nueva_velocidad, nueva_direccion


# -----------------------------------------
# 9. Cálculo de la Posición del Barco después de un Tiempo
# -----------------------------------------

def calcular_nueva_posicion(latitud_inicial: float, longitud_inicial: float, velocidad_nudos: float, direccion: float, tiempo_horas: float) -> tuple:
    """
    Calcula la nueva posición del barco después de un tiempo dado, con una velocidad constante y dirección.
    
    :param latitud_inicial: latitud inicial del barco
    :param longitud_inicial: longitud inicial del barco
    :param velocidad_nudos: velocidad en nudos
    :param direccion: dirección del barco en grados (0° a 360°)
    :param tiempo_horas: tiempo transcurrido en horas
    :return: nueva latitud y longitud del barco
    """
    from geopy.distance import distance
    import math
    # Distancia recorrida en millas náuticas
    distancia_millas_nauticas = velocidad_nudos * tiempo_horas
    # Convertir la dirección en grados a radianes
    direccion_radianes = math.radians(direccion)
    
    # Calcular el cambio en latitud y longitud (simplificación)
    delta_lat = distancia_millas_nauticas * math.cos(direccion_radianes) / 60
    delta_lon = distancia_millas_nauticas * math.sin(direccion_radianes) / 60
    
    nueva_latitud = latitud_inicial + delta_lat
    nueva_longitud = longitud_inicial + delta_lon
    
    return nueva_latitud, nueva_longitud


# -----------------------------------------
# 10. Cálculo de la Carga Máxima del Barco
# -----------------------------------------

def calcular_capacidad_carga(peso_carga_actual: float, peso_maximo: float) -> str:
    """
    Calcula si el barco está sobrecargado o dentro de su capacidad de carga.
    
    :param peso_carga_actual: peso actual de la carga en toneladas
    :param peso_maximo: peso máximo que puede soportar el barco en toneladas
    :return: mensaje sobre el estado de la carga
    """
    if peso_carga_actual > peso_maximo:
        return "El barco está sobrecargado."
    else:
        return "El barco tiene capacidad suficiente para la carga."


# Ejemplo de uso
if __name__ == "__main__":
    try:
        print(calcular_consumo_combustible(10, 5))  # Ejemplo de uso
        print(convertir_velocidad(20, 'nudos', 'km/h'))
    except ValueError as e:
        print(e)

# Fin del archivo
