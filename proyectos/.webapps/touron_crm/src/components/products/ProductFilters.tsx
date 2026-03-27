"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"; // Need to create

const categories = [
    { id: 'All', label: 'Todos' },
    { id: 'Engine', label: 'Motores' },
    { id: 'Boat', label: 'Embarcaciones' },
    { id: 'Part', label: 'Repuestos' },
    { id: 'Accessory', label: 'Accesorios' },
];

export function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || 'All';

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === 'All') {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-nautical-primary mb-4">Filtrar por Categoría</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={currentCategory === cat.id ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => handleCategoryChange(cat.id)}
                        >
                            {cat.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
