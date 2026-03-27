'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Anchor, Settings, Ship, ChevronRight, Zap } from "lucide-react";
import { formatPrice } from '@/lib/currency';

export function ProductCard({ product, currencyCode = 'EUR' }: { product: any, currencyCode?: string }) {

    // Helper to determine icon based on category
    const getIcon = () => {
        if (product.brand === 'Mercury' || product.name.includes('Mercury')) {
            return <Zap className="h-12 w-12 text-slate-100 group-hover:text-nautical-accent transition duration-500" />;
        }
        return <Ship className="h-12 w-12 text-slate-100 group-hover:text-nautical-accent transition duration-500" />;
    };

    const [imageError, setImageError] = useState(false);

    return (
        <Link href={`/products/${product.id}`} className="block group">
            <Card className="overflow-hidden border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 bg-white rounded-2xl h-full flex flex-col">
                <div className="relative h-56 bg-slate-50 overflow-hidden flex items-center justify-center">
                    {product.image && !imageError ? (
                        <div className="w-full h-full p-4 flex items-center justify-center">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-110 transition duration-700"
                                onError={() => setImageError(true)}
                            />
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-50 rounded-full blur-2xl"></div>
                            {getIcon()}
                        </div>
                    )}

                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${product.brand === 'Mercury' ? 'bg-black text-white' :
                            product.brand === 'Quicksilver' ? 'bg-nautical-accent text-white' :
                                'bg-nautical-gold text-nautical-primary'
                            }`}>
                            {product.brand}
                        </span>
                    </div>

                    <div className="absolute top-4 right-4">
                        <Badge className={`${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border-none shadow-sm text-[10px] font-bold`}>
                            {product.stock > 0 ? `${product.stock} Stock` : "BAJO PEDIDO"}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-nautical-accent uppercase tracking-widest">{product.series || product.category}</span>
                        </div>
                        <CardTitle className="text-xl font-bold text-nautical-primary group-hover:text-nautical-accent transition-colors line-clamp-1">
                            {product.name}
                        </CardTitle>
                    </div>

                    <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-6 font-medium leading-relaxed">
                        {product.description || 'Consulta las especificaciones técnicas completas de este modelo.'}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                        <div className="text-lg font-black text-nautical-primary tracking-tight">
                            {formatPrice(product.price, currencyCode)}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-300 group-hover:text-nautical-accent transition">
                            DETALLES <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
