import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    MapPin,
    CreditCard,
    FileText,
    Anchor,
    Box,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/db';
import { settings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { formatPrice } from '@/lib/currency';

interface Product {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    thumbnail: string;
}

interface Cart {
    id: number;
    products: Product[];
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
}

async function getOrderDetail(id: string): Promise<Cart> {
    const res = await fetch(`https://dummyjson.com/carts/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('No se pudo encontrar el detalle del pedido.');
    return res.json();
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    if (!cookieStore.get('session')) {
        redirect('/login');
    }

    const currencySetting = await db.select().from(settings).where(eq(settings.key, 'currency')).get();
    const currencyCode = currencySetting?.value || 'EUR';

    let cart: Cart;
    try {
        cart = await getOrderDetail(id);
    } catch (e) {
        return (
            <div className="p-10 text-center bg-red-50 border border-red-100 rounded-[2rem]">
                <p className="text-red-600 font-bold">Error: Pedido no encontrado en la base de datos global.</p>
                <Link href="/orders" className="mt-4 inline-block text-nautical-accent font-bold underline">Volver a Pedidos</Link>
            </div>
        );
    }

    // Historial simulado basado en el ID para consistencia
    const history = [
        { status: "Pedido Recibido", date: "18 Feb 2026, 09:12", desc: "El sistema ha registrado la solicitud del distribuidor.", icon: <FileText className="h-4 w-4" />, done: true },
        { status: "Validación de Stock", date: "18 Feb 2026, 10:45", desc: "Disponibilidad confirmada en el almacén central de Touron.", icon: <Box className="h-4 w-4" />, done: true },
        { status: "Pago Confirmado", date: "18 Feb 2026, 11:30", desc: "Transacción procesada vía pasarela B2B segura.", icon: <CreditCard className="h-4 w-4" />, done: true },
        { status: "Preparación de Envío", date: "18 Feb 2026, 14:00", desc: "Mercancía embalada y etiquetada para transporte náutico.", icon: <Package className="h-4 w-4" />, done: Number(id) % 2 === 0 },
        { status: "En Tránsito", date: "Pendiente", desc: "El transportista ha recogido el lote en la zona de carga.", icon: <Truck className="h-4 w-4" />, done: false }
    ];

    const trackingId = `1Z${2026}${cart.id}${cart.userId}E0205271688`.substring(0, 18);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Back Button & Header */}
            <div className="flex items-center gap-4">
                <Link href="/orders">
                    <Button variant="ghost" className="rounded-xl gap-2 text-slate-500 hover:text-nautical-primary">
                        <ArrowLeft className="h-4 w-4" /> Volver
                    </Button>
                </Link>
                <div className="h-8 w-px bg-slate-100"></div>
                <h2 className="text-2xl font-black text-nautical-primary tracking-tight">Detalle del Pedido #{trackingId}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Products & Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="font-bold text-nautical-primary flex items-center gap-2">
                                <Package className="h-4 w-4 text-nautical-accent" /> Productos Solicitados
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {cart.products.map(product => (
                                <div key={product.id} className="p-6 flex items-center gap-4 hover:bg-slate-50/30 transition-colors">
                                    <div className="h-16 w-16 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden">
                                        <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{product.title}</p>
                                        <p className="text-xs text-slate-400 font-medium">Ref: BT-{product.id}-X</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-nautical-primary">{formatPrice(product.price, currencyCode)}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Cant: {product.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-slate-50/50 flex justify-between items-center">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total del Pedido</span>
                            <span className="text-xl font-black text-nautical-primary">{formatPrice(cart.total, currencyCode)}</span>
                        </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="bg-nautical-primary text-white p-8 rounded-[2rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10 -mr-10 -mt-10">
                            <Anchor className="h-40 w-40 text-white rotate-12" />
                        </div>
                        <div className="relative z-10 flex gap-6 items-center">
                            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <MapPin className="h-8 w-8 text-nautical-accent" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-nautical-accent uppercase tracking-[0.2em] mb-1">Punto de Entrega</p>
                                <p className="text-lg font-bold leading-tight">Distribuidor Oficial # {cart.userId}</p>
                                <p className="text-sm text-slate-300 font-medium">Zona Portuaria, Muelle 4, Barcelona - España</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Timeline / History */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-nautical-primary mb-8 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-nautical-accent" /> Historial de Tracking
                        </h3>
                        <div className="space-y-8">
                            {history.map((event, idx) => (
                                <div key={idx} className="flex gap-4 relative">
                                    {idx !== history.length - 1 && (
                                        <div className={`absolute left-[15px] top-[30px] bottom-[-20px] w-px ${event.done ? 'bg-nautical-accent' : 'bg-slate-100'}`}></div>
                                    )}
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${event.done ? 'bg-nautical-accent text-white' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>
                                        {event.done ? <CheckCircle2 className="h-4 w-4" /> : event.icon}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${event.done ? 'text-nautical-primary' : 'text-slate-400'}`}>{event.status}</p>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{event.date}</p>
                                        <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{event.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Google Tracking Integration (Demo Proof) */}
                        <div className="mt-10 pt-8 border-t border-slate-50">
                            <a
                                href={`https://www.google.com/search?q=tracking+number+${trackingId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 hover:bg-white hover:shadow-md border border-slate-100 rounded-2xl text-xs font-black text-nautical-primary uppercase tracking-widest transition-all group"
                            >
                                <Search className="h-4 w-4 text-nautical-accent group-hover:scale-110 transition-transform" />
                                Verificar en Google
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
