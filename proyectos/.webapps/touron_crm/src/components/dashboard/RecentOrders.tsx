import { Avatar } from '@/components/ui/avatar'; // Needs to be created or mocked
import { formatPrice } from '@/lib/currency';

export function RecentOrders({ currencyCode = 'EUR' }: { currencyCode?: string }) {

    return (
        <div className="space-y-8">
            {[1, 2, 3].map((i) => (
                <div className="flex items-center" key={i}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-nautical-bg border border-gray-200">
                        <span className="text-xs font-medium text-nautical-primary">NM</span>
                    </div>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Náutica Madrid</p>
                        <p className="text-sm text-gray-500">Mercury F 150 XL x 2</p>
                    </div>
                    <div className="ml-auto font-medium text-nautical-primary">+{formatPrice(37000, currencyCode)}</div>
                </div>
            ))}
        </div>
    );
}
