import {
    UserPlus,
    ShieldCheck,
    ShoppingCart,
    Package,
    AlertCircle
} from 'lucide-react';

interface Activity {
    id: number;
    type: 'client' | 'warranty' | 'order' | 'stock' | 'system';
    title: string;
    description: string;
    time: string;
}

const mockActivities: Activity[] = [
    { id: 1, type: 'client', title: 'Nuevo Concesionario', description: 'Náutica Baleares se ha unido a la red.', time: 'Hace 5 min' },
    { id: 2, type: 'warranty', title: 'Garantía Registrada', description: 'Motor Mercury F150 (SN: 2B123456)', time: 'Hace 25 min' },
    { id: 3, type: 'order', title: 'Pedido Procesado', description: 'Pedido #8902 - 5 unidades Aceite 25W-40', time: 'Hace 1 hora' },
    { id: 4, type: 'stock', title: 'Aviso de Stock', description: 'Hélice Enertia 19p bajo mínimos (2 uds)', time: 'Hace 3 horas' },
];

export function ActivityFeed() {
    const getIcon = (type: string) => {
        switch (type) {
            case 'client': return <UserPlus className="h-4 w-4 text-emerald-500" />;
            case 'warranty': return <ShieldCheck className="h-4 w-4 text-blue-500" />;
            case 'order': return <ShoppingCart className="h-4 w-4 text-nautical-accent" />;
            case 'stock': return <AlertCircle className="h-4 w-4 text-red-500" />;
            default: return <Package className="h-4 w-4 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-4">
            {mockActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="mt-1 p-2 rounded-lg bg-white shadow-sm border border-slate-100 group-hover:border-slate-200 transition-colors">
                        {getIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-nautical-primary truncate">{activity.title}</p>
                            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">{activity.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{activity.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
