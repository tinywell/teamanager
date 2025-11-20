export type TeaType = 'Green' | 'Black' | 'Oolong' | 'White' | 'Puerh' | 'Herbal' | 'Yellow';

export interface Tea {
    id: string;
    name: string;
    type: TeaType;
    origin: string;
    harvestYear?: number;
    vendor?: string;
    stockWeight: number; // in grams
    purchaseDate: string;
    rating: number;
    notes: string;
    imageUrl?: string; // kept for backward compatibility or external URLs
    imageBlobId?: string; // ID for IndexedDB storage
}

export interface BrewLog {
    id: string;
    teaId: string;
    date: string;
    waterTemp: number; // Celsius
    steepTime: number; // Seconds
    teaAmount?: number; // in grams
    rating: number;
    tastingNotes: string[];
}
