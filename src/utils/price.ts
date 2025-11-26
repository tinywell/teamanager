/**
 * Calculate price per gram
 */
export const calculatePricePerGram = (price: number, weight: number): number => {
    if (!weight || weight <= 0) return 0;
    return Number((price / weight).toFixed(2));
};

/**
 * Get price grade based on price per gram (CNY/g)
 * Ranges:
 * - < 0.5: Daily (口粮)
 * - 0.5 - 2.0: Premium (进阶)
 * - 2.0 - 5.0: High-End (高端)
 * - > 5.0: Luxury (奢华)
 */
export const getPriceGrade = (pricePerGram: number): { label: string; color: string } => {
    if (pricePerGram <= 0) return { label: 'Unknown', color: 'bg-stone-100 text-stone-500' };
    if (pricePerGram < 0.5) return { label: 'Daily', color: 'bg-blue-100 text-blue-800' };
    if (pricePerGram < 2.0) return { label: 'Premium', color: 'bg-green-100 text-green-800' };
    if (pricePerGram < 5.0) return { label: 'High-End', color: 'bg-purple-100 text-purple-800' };
    return { label: 'Luxury', color: 'bg-amber-100 text-amber-800' };
};
