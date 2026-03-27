import { ReactNode } from 'react';
import { db } from '@/lib/db';
import { products, settings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    CheckCircle2,
    Zap,
    Ship,
    Settings,
    ShieldCheck,
    PackageCheck,
    Pencil,
    Anchor
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { formatPrice } from '@/lib/currency';


export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const product = await db.query.products.findFirst({
        where: eq(products.id, id)
    });

    const currencySetting = await db.select().from(settings).where(eq(settings.key, 'currency')).get();
    const currencyCode = currencySetting?.value || 'EUR';


    const cookieStore = await cookies();
    const isLoggedIn = !!cookieStore.get('session');


    if (!product) notFound();

    let specs = {};
    try {
        specs = JSON.parse(product.specs || '{}');
    } catch {
        specs = {};
    }

    return (
        <div className="min-h-screen bg-slate-50/50 -mt-6 -ml-6 -mr-6">
            {/* Top Bar / Breadcrumb */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <Link href="/products" className="flex items-center gap-2 text-slate-500 hover:text-nautical-primary transition group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">PIM</span>
                </Link>
                <div className="flex items-center gap-4">
                    {isLoggedIn && (
                        <Link href={`/admin/products/edit/${product.id}`}>
                            <Button variant="outline" size="sm" className="gap-2 border-slate-200 text-slate-600 hover:text-nautical-primary">
                                <Pencil className="h-4 w-4" />
                                Editar Producto
                            </Button>
                        </Link>
                    )}
                    <Badge variant="outline" className="border-nautical-accent text-nautical-accent font-bold uppercase text-[10px]">
                        {product.brand} Official
                    </Badge>
                </div>
            </div>

            <main className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Left: Product Visuals */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-12 aspect-square flex items-center justify-center shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden group">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-110 transition duration-700"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-100 italic">
                                {product.brand === 'Mercury' ?
                                    <Zap className="h-64 w-64 opacity-20" /> :
                                    <Ship className="h-64 w-64 opacity-20" />
                                }
                                <span className="text-slate-300 mt-4 not-italic">Imagen no disponible</span>
                            </div>
                        )}
                        <div className="absolute top-8 left-8">
                            <Badge className="bg-nautical-primary text-white border-none px-3 py-1 text-xs">{product.category.toUpperCase()}</Badge>
                        </div>
                    </div>

                    <div className="px-4">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-px w-8 bg-nautical-accent"></span>
                            <span className="text-nautical-accent font-bold text-xs uppercase tracking-[0.2em]">{product.series || 'Standard Series'}</span>
                        </div>
                        <h1 className="text-6xl font-black text-nautical-primary leading-none mb-6 tracking-tighter uppercase">
                            {product.name}
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
                            {product.description || 'No hay descripción disponible para este producto en el catálogo oficial.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 px-4">
                        <FeatureBadge icon={<CheckCircle2 className="h-4 w-4" />} label="Garantía Oficial Mercury" />
                        <FeatureBadge icon={<ShieldCheck className="h-4 w-4" />} label="Certificado de Conformidad" />
                    </div>
                </div>

                {/* Right: Technical Specifications */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden">
                        <div className="bg-nautical-primary p-8 flex items-center justify-between">
                            <h3 className="text-white font-bold flex items-center gap-3 text-lg">
                                <Settings className="h-6 w-6 text-nautical-accent" />
                                FICHA TÉCNICA
                            </h3>
                            <div className="text-right">
                                <div className="text-nautical-accent text-[10px] font-black tracking-widest uppercase">REF #{product.id.toString().padStart(4, '0')}</div>
                                <div className="text-white/40 text-[9px] uppercase font-medium">Actualizado 2025</div>
                            </div>
                        </div>

                        <div className="p-8 space-y-1">
                            {Object.entries(specs).map(([key, value]) => (
                                <div key={key} className="flex flex-col py-4 border-b border-slate-50 last:border-0 group hover:bg-slate-50/80 px-4 -mx-4 rounded-2xl transition-all duration-300">
                                    <div className="flex justify-between items-center w-full">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-nautical-accent transition">
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </span>
                                        {typeof value !== 'object' || value === null ? (
                                            <span className="text-lg font-extrabold text-nautical-primary text-right tracking-tight">
                                                {value as string}
                                            </span>
                                        ) : null}
                                    </div>

                                    {typeof value === 'object' && value !== null && (
                                        <div className="mt-4 grid grid-cols-1 gap-1 w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            {Object.entries(value as object).map(([subKey, subValue]) => (
                                                <div key={subKey} className="flex justify-between items-center py-1.5 border-b border-white last:border-0">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                        {subKey.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className="text-xs font-black text-nautical-primary">
                                                        {String(subValue)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {Object.keys(specs).length === 0 && (
                                <div className="text-center py-12 text-slate-300 italic">
                                    No se han especificado detalles técnicos.
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs text-slate-400 font-medium">Precio PVP Sugerido</div>
                                <div className="text-2xl font-black text-nautical-primary">
                                    {formatPrice(product.price, currencyCode)}
                                </div>
                            </div>
                            <button className="w-full bg-nautical-primary hover:bg-nautical-accent text-white font-bold py-5 rounded-[1.25rem] transition-all duration-300 shadow-xl shadow-nautical-primary/20 hover:shadow-nautical-accent/40 flex items-center justify-center gap-3 active:scale-[0.98]">
                                <Anchor className="h-5 w-5" />
                                GENERAR PRESUPUESTO PDF
                            </button>
                        </div>
                    </div>

                    {/* Stock Card */}
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                <PackageCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponibilidad Red</p>
                                <p className="text-lg font-bold text-slate-700">{product.stock > 0 ? `${product.stock} Unidades en Stock` : 'Bajo Pedido'}</p>
                            </div>
                        </div>
                        {product.stock > 0 && (
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />)}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function FeatureBadge({ icon, label }: { icon: ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-3 bg-white border border-slate-100 px-5 py-3 rounded-2xl text-[11px] font-black text-nautical-primary shadow-sm hover:shadow-md transition-shadow cursor-default uppercase tracking-tighter">
            <span className="text-nautical-accent">{icon}</span>
            {label}
        </div>
    );
}
