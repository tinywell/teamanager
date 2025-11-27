import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTeas } from '../hooks/useTeas';
import { ArrowLeft, Edit2, MapPin, Package, Calendar, Coins, Leaf, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { get } from 'idb-keyval';
import { calculatePricePerGram, getPriceGrade } from '../utils/price';
import { clsx } from 'clsx';

const TeaDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { teas } = useTeas();
    const { t } = useTranslation();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const tea = teas.find(t => t.id === id);

    useEffect(() => {
        if (!tea) {
            navigate('/inventory');
            return;
        }

        if (tea.imageBlobId) {
            get(tea.imageBlobId).then((blob) => {
                if (blob) {
                    setImageUrl(URL.createObjectURL(blob));
                }
            });
        }
    }, [tea, navigate]);

    if (!tea) return null;

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
    const usedWeight = (tea.initialWeight || tea.stockWeight) - tea.stockWeight;
    const usagePercentage = tea.initialWeight
        ? ((usedWeight / tea.initialWeight) * 100).toFixed(1)
        : 0;

    return (
        <div className="animate-fade-in pt-4 pb-20">
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-stone-600" />
                    </button>
                    <h1 className="text-2xl font-serif font-bold text-ink">Tea Details</h1>
                </div>
                <Link
                    to={`/inventory/edit/${tea.id}`}
                    className="p-2 text-tea-600 hover:bg-tea-50 rounded-full transition-colors"
                >
                    <Edit2 size={20} />
                </Link>
            </header>

            {/* Image Section */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden mb-4">
                <div className="h-64 bg-stone-200 relative">
                    {imageUrl ? (
                        <img src={imageUrl} alt={tea.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <Leaf size={64} />
                        </div>
                    )}
                    <div className={clsx(
                        "absolute top-4 right-4 px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider shadow-md",
                        typeColors[tea.type] || 'bg-stone-100 text-stone-800'
                    )}>
                        {t(`teaTypes.${tea.type}`)}
                    </div>
                </div>
            </div>

            {/* Title and Price Grade */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 mb-4">
                <div className="flex justify-between items-start gap-3 mb-4">
                    <h2 className="text-3xl font-serif font-bold text-ink">{tea.name}</h2>
                    {pricePerGram > 0 && (
                        <span className={clsx(
                            "px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap",
                            grade.color
                        )}>
                            {grade.label}
                        </span>
                    )}
                </div>

                {tea.notes && (
                    <p className="text-stone-600 leading-relaxed">{tea.notes}</p>
                )}
            </div>

            {/* Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 mb-4">
                <h3 className="text-lg font-bold text-ink mb-4">Basic Information</h3>
                <div className="space-y-3">
                    {tea.origin && (
                        <div className="flex items-center gap-3">
                            <MapPin size={18} className="text-stone-400" />
                            <div>
                                <div className="text-xs text-stone-500">Origin</div>
                                <div className="font-medium text-ink">{tea.origin}</div>
                            </div>
                        </div>
                    )}

                    {tea.vendor && (
                        <div className="flex items-center gap-3">
                            <Store size={18} className="text-stone-400" />
                            <div>
                                <div className="text-xs text-stone-500">Vendor</div>
                                <div className="font-medium text-ink">{tea.vendor}</div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-stone-400" />
                        <div>
                            <div className="text-xs text-stone-500">Purchase Date</div>
                            <div className="font-medium text-ink">
                                {new Date(tea.purchaseDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock & Price Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 mb-4">
                <h3 className="text-lg font-bold text-ink mb-4">Stock & Pricing</h3>

                {/* Stock Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-stone-600">Stock Remaining</span>
                        <span className="text-sm font-bold text-tea-600">
                            {tea.stockWeight}g / {tea.initialWeight || tea.stockWeight}g
                        </span>
                    </div>
                    <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-tea-500 to-tea-600 transition-all duration-500"
                            style={{ width: `${100 - Number(usagePercentage)}%` }}
                        />
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                        {usagePercentage}% used ({usedWeight}g consumed)
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-stone-500 mb-1">
                            <Package size={16} />
                            <span className="text-xs">Current Stock</span>
                        </div>
                        <div className="text-2xl font-bold text-ink">{tea.stockWeight}g</div>
                    </div>

                    {tea.price && tea.price > 0 && (
                        <>
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 text-stone-500 mb-1">
                                    <Coins size={16} />
                                    <span className="text-xs">Total Price</span>
                                </div>
                                <div className="text-2xl font-bold text-ink">¥{tea.price}</div>
                            </div>

                            <div className="bg-tea-50 p-4 rounded-lg col-span-2">
                                <div className="flex items-center gap-2 text-tea-700 mb-1">
                                    <Coins size={16} />
                                    <span className="text-xs font-medium">Price per Gram</span>
                                </div>
                                <div className="text-3xl font-bold text-tea-600">
                                    ¥{pricePerGram}/g
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Rating */}
            {tea.rating > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                    <h3 className="text-lg font-bold text-ink mb-3">Rating</h3>
                    <div className="text-3xl">
                        {'★'.repeat(tea.rating)}
                        <span className="text-stone-300">{'★'.repeat(5 - tea.rating)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeaDetail;
