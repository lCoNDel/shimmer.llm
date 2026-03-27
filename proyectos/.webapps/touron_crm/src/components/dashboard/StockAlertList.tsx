import { AlertTriangle, PackageSearch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StockAlert {
    id: number;
    name: string;
    brand: string;
    stock: number;
    image?: string | null;
}

export function StockAlertList({ items }: { items: StockAlert[] }) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-slate-300 italic">
                <PackageSearch className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-xs">Todo el inventario crítico al día</p>
            </div>
        );
    }

    return (
        <div className="grid gap-3">
            {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100/50 hover:border-red-100 transition-colors group">
                    <div className="h-12 w-12 rounded-xl bg-white p-2 flex items-center justify-center border border-slate-100 shadow-sm relative overflow-hidden">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                        ) : (
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                        )}
                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${item.brand === 'Mercury' ? 'bg-black text-white' :
                                    item.brand === 'Quicksilver' ? 'bg-nautical-accent text-white' :
                                        'bg-nautical-gold text-nautical-primary'
                                }`}>
                                {item.brand}
                            </span>
                            <p className="text-xs font-bold text-nautical-primary truncate">{item.name}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500"
                                    style={{ width: `${(item.stock / 5) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-[10px] font-black text-red-600">{item.stock} uds</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
