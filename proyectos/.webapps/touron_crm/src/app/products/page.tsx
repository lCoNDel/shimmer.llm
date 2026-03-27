import { ReactNode } from 'react';
import { db } from '@/lib/db';
import { products, settings } from '@/lib/schema';
import { like, eq, and, or, sql, count } from 'drizzle-orm';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductSearch } from '@/components/products/ProductSearch';
import { Anchor, Shield, Zap, Ship, Settings, Lock, LogIn } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';

export default async function ProductsPage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const cookieStore = await cookies();
    const isLoggedIn = !!cookieStore.get('session');

    const searchParams = await props.searchParams;
    const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
    const q = typeof searchParams?.q === 'string' ? searchParams.q : undefined;
    const brand = typeof searchParams?.brand === 'string' ? searchParams.brand : undefined;

    const conditions = [];
    if (category && category !== 'All') {
        conditions.push(eq(products.category, category));
    }
    if (brand) {
        conditions.push(eq(products.brand, brand));
    }
    if (q) {
        conditions.push(or(
            like(products.name, `%${q}%`),
            like(products.description, `%${q}%`)
        ));
    }

    const allProducts = await db.select().from(products).where(and(...conditions));

    const [mercuryCount, quicksilverCount, baylinerCount, totalProducts, currencySetting] = await Promise.all([
        db.select({ count: count() }).from(products).where(eq(products.brand, 'Mercury')),
        db.select({ count: count() }).from(products).where(eq(products.brand, 'Quicksilver')),
        db.select({ count: count() }).from(products).where(eq(products.brand, 'Bayliner')),
        db.select({ count: count() }).from(products),
        db.select().from(settings).where(eq(settings.key, 'currency')).get()
    ]);

    const currencyMap: Record<string, string> = {
        'EUR': '€',
        'USD': '$',
        'GBP': '£'
    };
    const currencyCode = currencySetting?.value || 'EUR';
    const currencySymbol = currencyMap[currencyCode] || '€';


    return (
        <div className="space-y-0 -mt-6 -ml-6 -mr-6 animate-in fade-in duration-700">
            {/* PIM Style Hero Header */}
            <header className="bg-nautical-primary text-white py-8 px-8 shadow-inner overflow-hidden relative">
                <div className="absolute top-0 right-0 opacity-10 -mr-20 -mt-20">
                    <Anchor className="h-96 w-96 text-white rotate-12" />
                </div>

                <div className="relative z-10 px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Badge className="bg-nautical-accent hover:bg-nautical-accent text-white border-none text-[11px] font-black uppercase tracking-widest px-3 py-1.5 shadow-lg shadow-nautical-accent/20">Sistema PIM</Badge>
                                <span className="text-white/60 text-[11px] font-black uppercase tracking-widest border-l border-white/20 pl-3">Creado por Luis Conde</span>
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight">Inventario Global de Productos</h2>
                            <p className="text-nautical-accent/80 font-medium mt-1">Gestión Centralizada Mercury Marine & Touron Ecosystem</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto items-center">
                            <ProductSearch placeholder="Buscar por modelo, serie o descripción..." />
                            {isLoggedIn ? (
                                <Link href="/admin/products/new">
                                    <Button className="bg-nautical-accent hover:bg-nautical-accent/90 text-white font-bold h-10 px-6 rounded-full shadow-lg shadow-nautical-accent/20 border-none flex items-center gap-2 whitespace-nowrap">
                                        <Plus className="h-4 w-4" />
                                        Nuevo Modelo
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <Button className="bg-white hover:bg-white/90 text-nautical-primary font-bold h-10 px-6 rounded-full shadow-lg shadow-white/10 border-none flex items-center gap-2 whitespace-nowrap">
                                        <Lock className="h-4 w-4" />
                                        Acceso Admin
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <BrandCategoryCard
                            icon={<Zap className="h-5 w-5" />}
                            label="Motores Mercury"
                            count={mercuryCount[0]?.count || 0}
                            active={brand === 'Mercury'}
                            href="/products?brand=Mercury"
                        />
                        <BrandCategoryCard
                            icon={<Ship className="h-5 w-5" />}
                            label="Barcos Quicksilver"
                            count={quicksilverCount[0]?.count || 0}
                            active={brand === 'Quicksilver'}
                            href="/products?brand=Quicksilver"
                        />
                        <BrandCategoryCard
                            icon={<Anchor className="h-5 w-5" />}
                            label="Cruceros Bayliner"
                            count={baylinerCount[0]?.count || 0}
                            active={brand === 'Bayliner'}
                            href="/products?brand=Bayliner"
                        />
                        <BrandCategoryCard
                            icon={<Settings className="h-5 w-5" />}
                            label="Catálogo Completo"
                            count={totalProducts[0]?.count || 0}
                            active={!brand}
                            href="/products"
                        />
                    </div>
                </div>
            </header>

            <div className="p-4">
                <div className="flex flex-col md:flex-row gap-6">
                    <aside className="w-full md:w-64 flex-none">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sticky top-6">
                            <h3 className="font-bold text-nautical-primary mb-4 flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Filtros Avanzados
                            </h3>
                            <ProductFilters />
                        </div>
                    </aside>

                    <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-nautical-primary">
                                {brand ? `Resultados: ${brand}` : 'Todos los Productos'}
                            </h3>
                            <div className="text-sm text-slate-400">
                                Mostrando <span className="font-bold text-nautical-secondary">{allProducts.length}</span> unidades
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allProducts.map((product) => (
                                <ProductCard key={product.id} product={product} currencyCode={currencyCode} />
                            ))}
                            {allProducts.length === 0 && (
                                <div className="col-span-full text-center py-24 text-gray-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                    <Ship className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg font-medium">No se han encontrado productos.</p>
                                    <p className="text-sm">Prueba ajustando los filtros o el término de búsqueda.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



function BrandCategoryCard({ icon, label, count, active = false, href }: { icon: ReactNode, label: string, count: number, active?: boolean, href: string }) {
    return (
        <Link href={href} className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${active ? 'bg-nautical-accent text-white shadow-lg scale-105' : 'bg-white/5 hover:bg-white/10 text-white'
            }`}>
            <div className={`p-3 rounded-lg ${active ? 'bg-white/20' : 'bg-nautical-primary border border-white/10'}`}>
                {icon}
            </div>
            <div>
                <div className="text-xs font-bold leading-none mb-1">{label}</div>
                <div className={`text-[10px] ${active ? 'text-white/80' : 'text-slate-400'}`}>{count} Unidades</div>
            </div>
        </Link>
    );
}
