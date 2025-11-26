import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Tea } from '../types';
import { Leaf, MapPin, Package, Coins, Edit2 } from 'lucide-react';
import { clsx } from 'clsx';
import { get } from 'idb-keyval';
import { calculatePricePerGram, getPriceGrade } from '../utils/price';

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

    const pricePerGram = tea.price && tea.initialWeight
        ? calculatePricePerGram(tea.price, tea.initialWeight)
        : 0;

    const grade = getPriceGrade(pricePerGram);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow relative group">
            <Link to={`/inventory/edit/${tea.id}`} className="absolute top-2 left-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-stone-600">
                <Edit2 size={14} />
            </Link>

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
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif font-bold text-ink truncate flex-1">{tea.name}</h3>
                    {pricePerGram > 0 && (
                        <span className={clsx(
                            "px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap",
                            grade.color
                        )}>
                            {grade.label}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                    <MapPin size={12} />
                    <span className="truncate">{tea.origin || 'Unknown Origin'}</span>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                        <Package size={12} />
                        <span>{tea.stockWeight}g</span>
                    </div>

                    {pricePerGram > 0 && (
                        <div className="flex items-center gap-1 text-xs text-stone-500">
                            <Coins size={12} />
                            <span>¥{pricePerGram}/g</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeaCard;
