'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, Image as ImageIcon, Upload, Link as LinkIcon, X } from 'lucide-react';
import { updateProduct } from '@/app/actions';

interface Product {
    id: number;
    name: string;
    brand: string;
    category: string;
    series: string | null;
    description: string | null;
    price: number | null;
    image: string | null;
    specs: string | null;
}

export default function ProductEditForm({ product, currencySymbol = '€' }: { product: Product, currencySymbol?: string }) {

    const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
    const [previewUrl, setPreviewUrl] = useState<string | null>(product.image);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (imageMode === 'file' && e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else if (imageMode === 'url') {
            setPreviewUrl(e.target.value);
        }
    };

    const specs = JSON.parse(product.specs || '{}');
    const specsString = JSON.stringify(specs, null, 2);

    return (
        <form action={updateProduct.bind(null, product.id)} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Nombre del Producto *
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        defaultValue={product.name}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-bold text-nautical-primary"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Marca *
                    </label>
                    <select
                        name="brand"
                        required
                        defaultValue={product.brand}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-bold text-nautical-primary appearance-none"
                    >
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
                        defaultValue={product.category}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-bold text-nautical-primary appearance-none"
                    >
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
                        defaultValue={product.series || ''}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-bold text-nautical-primary"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Precio ({currencySymbol})

                    </label>
                    <input
                        type="number"
                        name="price"
                        step="0.01"
                        defaultValue={product.price || ''}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all duration-300 font-bold text-nautical-primary"
                    />
                </div>
            </div>

            {/* Image Section */}
            <div className="space-y-4 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-nautical-primary uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-nautical-accent" />
                        Imagen del Producto (PIM Media)
                    </label>
                    <div className="flex bg-white rounded-xl p-1 border border-slate-100 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setImageMode('url')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${imageMode === 'url' ? 'bg-nautical-primary text-white shadow-md' : 'text-slate-400 hover:text-nautical-primary'}`}
                        >
                            URL
                        </button>
                        <button
                            type="button"
                            onClick={() => setImageMode('file')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${imageMode === 'file' ? 'bg-nautical-primary text-white shadow-md' : 'text-slate-400 hover:text-nautical-primary'}`}
                        >
                            UPLOAD
                        </button>
                    </div>
                </div>

                <div className="flex gap-8 items-start">
                    <div className="flex-1">
                        {imageMode === 'url' ? (
                            <input
                                type="text"
                                name="imageUrl"
                                placeholder="https://media.mercurymarine.com/..."
                                defaultValue={product.image || ''}
                                onChange={handleImageChange}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition bg-white font-medium text-slate-600"
                            />
                        ) : (
                            <div className="relative group/upload">
                                <input
                                    type="file"
                                    name="imageFile"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition bg-white file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-nautical-accent/10 file:text-nautical-accent hover:file:bg-nautical-accent/20 cursor-pointer"
                                />
                            </div>
                        )}
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-3 ml-1">
                            {imageMode === 'url' ? 'Vincula imagen desde assets oficiales' : 'Formatos recomendados: WebP, PNG (Transparent).'}
                        </p>
                    </div>

                    {previewUrl && (
                        <div className="w-40 h-40 bg-white rounded-2xl border border-slate-200 p-3 shadow-xl flex-shrink-0 relative group">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                            <button
                                type="button"
                                onClick={() => setPreviewUrl(null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Descripción
                </label>
                <textarea
                    name="description"
                    rows={3}
                    defaultValue={product.description || ''}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition resize-none font-medium text-slate-600"
                />
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Especificaciones Técnicas (JSON)
                </label>
                <textarea
                    name="specs"
                    rows={6}
                    defaultValue={specsString}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition font-mono text-xs text-nautical-secondary"
                />
            </div>

            <div className="flex gap-4 pt-6">
                <Link
                    href={`/products/${product.id}`}
                    className="flex-1 py-5 px-8 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase tracking-widest text-center hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    className="flex-[2] bg-nautical-primary hover:bg-nautical-accent text-white font-black uppercase tracking-[0.2em] py-5 px-8 rounded-2xl transition-all shadow-xl shadow-nautical-primary/10 hover:shadow-nautical-accent/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    <Save className="h-5 w-5" />
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
}
