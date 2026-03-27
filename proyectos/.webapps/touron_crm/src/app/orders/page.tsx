import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
    Package,
    Truck,
    CheckCircle2,
    Clock,
    Search,
    ArrowUpRight,
    ExternalLink,
    MapPin,
    ClipboardList,
    Radar,
    Satellite
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/db';
import { settings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { formatPrice } from '@/lib/currency';

// Definición de tipos para la API externa
interface ExternalCart {
    id: number;
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
}

interface ExternalData {
    carts: ExternalCart[];
}

// Simulador de nombres de distribuidores y estados para la demo
const DISTRIBUTORS = [
    "Náutica Balear S.L.",
    "Suministros del Mar",
    "Port Olympic Marina",
    "Evinrude Services Spain",
    "Yates & Motores Costa Brava",
    "Mercury Official Dealer"
];

const STATUSES = [
    { label: "Pendiente", icon: <Clock className="h-3 w-3" />, color: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Enviado", icon: <Truck className="h-3 w-3" />, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Entregado", icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-emerald-50 text-emerald-700 border-emerald-200" }
];

async function getLiveOrders(): Promise<ExternalData> {
    const res = await fetch('https://dummyjson.com/carts', { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Error al conectar con el servidor de pedidos global.');
    return res.json();
}

export default async function OrdersPage() {
    const cookieStore = await cookies();
    if (!cookieStore.get('session')) {
        redirect('/login');
    }

    const currencySetting = await db.select().from(settings).where(eq(settings.key, 'currency')).get();
    const currencyCode = currencySetting?.value || 'EUR';

    let data: ExternalData;
    try {
        data = await getLiveOrders();
    } catch (error) {
        return (
            <div className="p-10 text-center bg-red-50 border border-red-100 rounded-[2rem]">
                <p className="text-red-600 font-bold italic">Error de Conexión: No se pudo sincronizar con el Hubble de pedidos.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Conectado */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
                <div>
                    <h2 className="text-4xl font-black text-nautical-primary tracking-tighter">CENTRAL DE PEDIDOS</h2>
                    <p className="text-slate-500 font-medium">Sincronización en tiempo real con la pasarela global de distribución.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold gap-2">
                        <ClipboardList className="h-4 w-4" /> Exportar Manifest
                    </Button>
                </div>
            </div>


            {/* Orders Feed */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Referencia</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Distribuidor / Cliente</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Items</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Neto</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.carts.map((cart, index) => {
                                const distributor = DISTRIBUTORS[cart.userId % DISTRIBUTORS.length];
                                const status = STATUSES[index % STATUSES.length];
                                const trackingId = `1Z${2026}${cart.id}${cart.userId}E0205271688`.substring(0, 18);

                                return (
                                    <tr key={cart.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-nautical-primary">#{trackingId}</span>
                                                <span className="text-[10px] text-slate-400 font-medium uppercase">UPS STANDARD</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-nautical-accent transition-colors">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-black text-slate-700">{distributor}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                                                {cart.totalProducts}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                                                {status.icon}
                                                {status.label}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="text-sm font-black text-nautical-primary">
                                                {formatPrice(cart.total, currencyCode)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <Link href={`/orders/${cart.id}`}>
                                                    <button className="p-2 rounded-lg hover:bg-white hover:text-nautical-accent hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-slate-300">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer de Sincronización */}
            <div className="flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-4">
                <span>Última Sincronización: {new Date().toLocaleTimeString()}</span>
                <span className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Proveedor de Datos: DummyJSON Global Orders
                </span>
            </div>
        </div>
    );
}
