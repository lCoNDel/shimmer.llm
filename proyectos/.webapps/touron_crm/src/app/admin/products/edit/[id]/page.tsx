import { db } from '@/lib/db';
import { products, settings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ArrowLeft, Edit3 } from 'lucide-react';
import Link from 'next/link';
import ProductEditForm from '@/components/products/ProductEditForm';

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const product = await db.query.products.findFirst({
        where: eq(products.id, id)
    });

    const currencySetting = await db.select().from(settings).where(eq(settings.key, 'currency')).get();
    const currencyMap: Record<string, string> = {
        'EUR': '€',
        'USD': '$',
        'GBP': '£'
    };
    const currencySymbol = currencyMap[currencySetting?.value || 'EUR'] || '€';

    if (!product) notFound();

    return (
        <div className="min-h-screen bg-slate-50/50 -mt-8 -mx-8">
            <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
                <Link href={`/products/${product.id}`} className="flex items-center gap-2 text-slate-500 hover:text-nautical-primary transition group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Volver a la Ficha</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-nautical-accent font-black uppercase tracking-widest">Edición de Producto</span>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                    <div className="bg-nautical-primary p-8 flex items-center gap-6">
                        <div className="bg-white/10 p-4 rounded-2xl">
                            <Edit3 className="h-8 w-8 text-nautical-accent" />
                        </div>
                        <div>
                            <h1 className="text-white font-black text-3xl tracking-tight uppercase">Editar Modelo</h1>
                            <p className="text-white/60 text-sm font-medium">Modificando {product.name}</p>
                        </div>
                    </div>

                    <ProductEditForm product={product} currencySymbol={currencySymbol} />
                </div>
            </main>
        </div>
    );
}
