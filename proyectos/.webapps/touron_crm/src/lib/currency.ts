export const EXCHANGE_RATES = {
    EUR: 1.0,
    USD: 1.05,
    GBP: 0.83
};

export function formatPrice(price: number | null, targetCurrency: string = 'EUR') {
    if (price === null) return 'N/A';

    const rate = EXCHANGE_RATES[targetCurrency as keyof typeof EXCHANGE_RATES] || 1.0;
    const convertedPrice = price * rate;

    return convertedPrice.toLocaleString('es-ES', {
        style: 'currency',
        currency: targetCurrency
    });
}
