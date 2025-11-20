import { useEffect, useState } from 'react';
import type { Tea } from '../types';
import { Leaf, MapPin, Package } from 'lucide-react';
import { clsx } from 'clsx';
import { get } from 'idb-keyval';

interface TeaCardProps {
    tea: Tea;
}

const TeaCard = ({ tea }: TeaCardProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (tea.imageBlobId) {
            get(tea.imageBlobId).then((blob) => {
                if (blob) {
                    setImageUrl(URL.createObjectURL(blob));
                }
            });
        }
    }, [tea.imageBlobId]);

    const typeColors: Record<string, string> = {
        Green: 'bg-green-100 text-green-800',
        Black: 'bg-red-100 text-red-800',
        Oolong: 'bg-amber-100 text-amber-800',
        White: 'bg-stone-100 text-stone-800',
        Puerh: 'bg-orange-100 text-orange-800',
        Herbal: 'bg-lime-100 text-lime-800',
        Yellow: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-stone-200 relative">
                {imageUrl ? (
                    <img src={imageUrl} alt={tea.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <Leaf size={32} />
                    </div>
                )}
                <div className={clsx(
                    "absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    typeColors[tea.type] || 'bg-stone-100 text-stone-800'
                )}>
                    {tea.type}
                </div>
            </div>

            <div className="p-3">
                <h3 className="font-serif font-bold text-ink truncate">{tea.name}</h3>
                <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                    <MapPin size={12} />
                    <span className="truncate">{tea.origin || 'Unknown Origin'}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                    <Package size={12} />
                    <span>{tea.stockWeight}g</span>
                </div>
            </div>
        </div>
    );
};

export default TeaCard;
