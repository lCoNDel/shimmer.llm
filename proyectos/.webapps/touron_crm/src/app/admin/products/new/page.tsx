'use client';

import { createProduct, importProductsBatch } from '@/app/actions';
import { ArrowLeft, Save, Package, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DataImporter } from '@/components/products/DataImporter';
import { useRouter } from 'next/navigation';

export default function AdminProductsNewPage() {
    const [view, setView] = useState<'form' | 'import'>('form');
    const router = useRouter();

    const handleImport = async (data: any[]) => {
        try {
            await importProductsBatch(data);
            alert(`Se importaron ${data.length} productos correctamente.`);
            router.push('/products');
        } catch (error) {
            alert("Hubo un error al importar los productos.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 -mt-8 -mx-8">
            <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
                <Link href="/products" className="flex items-center gap-2 text-slate-500 hover:text-nautical-primary transition group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Volver al PIM</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-nautical-accent font-black uppercase tracking-widest">Gestión de Inventario</span>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                    <div className="bg-nautical-primary p-8 flex items-center gap-6">
                        <div className="bg-white/10 p-4 rounded-2xl">
                            <Package className="h-8 w-8 text-nautical-accent" />
                        </div>
                        <div>
                            <h1 className="text-white font-black text-3xl tracking-tight uppercase">Nuevo Producto</h1>
                            <p className="text-white/60 text-sm font-medium">Alta oficial en el ecosistema Touron</p>
                        </div>
                        <div className="ml-auto flex bg-white/10 rounded-xl p-1">
                            <button
                                onClick={() => setView('form')}
                                className={`px-4 py-2 flex items-center gap-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'form' ? 'bg-white text-nautical-primary shadow-lg' : 'text-white/70 hover:text-white'}`}
                            >
                                <Package className="h-4 w-4" /> Manual
                            </button>
                            <button
                                onClick={() => setView('import')}
                                className={`px-4 py-2 flex items-center gap-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${view === 'import' ? 'bg-white text-nautical-primary shadow-lg' : 'text-white/70 hover:text-white'}`}
                            >
                                <UploadCloud className="h-4 w-4" /> Importar CSV/JSON
                            </button>
                        </div>
                    </div>

                    {view === 'import' ? (
                        <div className="p-10">
                            <DataImporter onImport={handleImport} />
                        </div>
                    ) : (
                        <form action={createProduct} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Nombre del Producto *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-bold text-nautical-primary"
                                        placeholder="ej. Mercury Verado 300"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Marca *
                                    </label>
                                    <select
                                        name="brand"
                                        required
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-bold text-nautical-primary appearance-none"
                                    >
                                        <option value="">Seleccionar marca</option>
                                        <option value="Mercury">Mercury</option>
                                        <option value="Quicksilver">Quicksilver</option>
                                        <option value="Bayliner">Bayliner</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Categoría *
                                    </label>
                                    <select
                                        name="category"
                                        required
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-bold text-nautical-primary appearance-none"
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        <option value="Engine">Motor</option>
                                        <option value="Boat">Barco</option>
                                        <option value="Accessory">Accesorio</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Serie
                                    </label>
                                    <input
                                        type="text"
                                        name="series"
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-bold text-nautical-primary"
                                        placeholder="ej. Verado, Activ, etc."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Precio Sugerido (€)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-bold text-nautical-primary"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Descripción Comercial
                                </label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-medium text-slate-600 resize-none"
                                    placeholder="Escribe aquí los puntos clave de venta..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Especificaciones Técnicas (JSON)
                                </label>
                                <textarea
                                    name="specs"
                                    rows={6}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-mono text-xs text-nautical-secondary"
                                    placeholder='{"potencia": "300 CV", "peso": "250 kg"}'
                                    defaultValue='{}'
                                />
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">Formato JSON requerido para visualización en ficha</p>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Link
                                    href="/products"
                                    className="flex-1 py-5 px-8 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase tracking-widest text-center hover:bg-slate-50 transition-all active:scale-[0.98]"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-nautical-primary hover:bg-nautical-accent text-white font-black uppercase tracking-[0.2em] py-5 px-8 rounded-2xl transition-all shadow-xl shadow-nautical-primary/10 hover:shadow-nautical-accent/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    <Save className="h-5 w-5" />
                                    Guardar Producto
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
