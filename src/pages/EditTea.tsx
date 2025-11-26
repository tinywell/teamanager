import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTeas } from '../hooks/useTeas';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import type { TeaType } from '../types';
import { useTranslation } from 'react-i18next';
import ImageUpload from '../components/ImageUpload';

const teaTypes: TeaType[] = ['Green', 'Black', 'Oolong', 'White', 'Puerh', 'Herbal', 'Yellow'];

const EditTea = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { teas, updateTea, deleteTea } = useTeas();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        type: 'Oolong' as TeaType,
        origin: '',
        vendor: '',
        stockWeight: '',
        initialWeight: '',
        purchaseDate: '',
        price: '',
        notes: '',
        imageBlobId: ''
    });

    useEffect(() => {
        if (id && teas.length > 0) {
            const tea = teas.find(t => t.id === id);
            if (tea) {
                setFormData({
                    name: tea.name,
                    type: tea.type,
                    origin: tea.origin,
                    vendor: tea.vendor || '',
                    stockWeight: String(tea.stockWeight),
                    initialWeight: String(tea.initialWeight || tea.stockWeight),
                    purchaseDate: tea.purchaseDate,
                    price: String(tea.price || ''),
                    notes: tea.notes,
                    imageBlobId: tea.imageBlobId || ''
                });
            } else {
                navigate('/inventory');
            }
        }
    }, [id, teas, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        updateTea(id, {
            name: formData.name,
            type: formData.type,
            origin: formData.origin,
            vendor: formData.vendor,
            stockWeight: Number(formData.stockWeight) || 0,
            initialWeight: Number(formData.initialWeight) || 0,
            purchaseDate: formData.purchaseDate,
            price: Number(formData.price) || 0,
            notes: formData.notes,
            imageBlobId: formData.imageBlobId
        });
        navigate('/inventory');
    };

    const handleDelete = async () => {
        if (id && window.confirm(t('inventory.deleteConfirm'))) {
            await deleteTea(id);
            navigate('/inventory');
        }
    };

    return (
        <div className="animate-fade-in pt-4 pb-20">
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-stone-600" />
                    </button>
                    <h1 className="text-2xl font-serif font-bold text-ink">Edit Tea</h1>
                </div>
                <button
                    onClick={handleDelete}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                    <Trash2 size={20} />
                </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                    <label className="block text-sm font-bold text-stone-700 mb-3">Photo</label>
                    <ImageUpload
                        currentImageId={formData.imageBlobId}
                        onImageSelected={(id) => setFormData(prev => ({ ...prev, imageBlobId: id }))}
                    />
                </section>

                {/* Basic Info */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1">{t('inventory.fields.name')}</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-2 focus:ring-tea-200 outline-none"
                            placeholder={t('inventory.placeholders.name')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">{t('inventory.fields.type')}</label>
                        <div className="flex flex-wrap gap-2">
                            {teaTypes.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${formData.type === type
                                        ? 'bg-tea-600 text-white shadow-md'
                                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                        }`}
                                >
                                    {t(`teaTypes.${type}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Details */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">{t('inventory.fields.origin')}</label>
                            <input
                                type="text"
                                value={formData.origin}
                                onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-2 focus:ring-tea-200 outline-none"
                                placeholder={t('inventory.placeholders.origin')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">{t('inventory.fields.vendor')}</label>
                            <input
                                type="text"
                                value={formData.vendor}
                                onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                                className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-2 focus:ring-tea-200 outline-none"
                                placeholder={t('inventory.placeholders.vendor')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">Current Stock (g)</label>
                            <input
                                type="number"
                                value={formData.stockWeight}
                                onChange={e => setFormData({ ...formData, stockWeight: e.target.value })}
                                className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-2 focus:ring-tea-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">Initial Weight (g)</label>
                            <input
                                type="number"
                                value={formData.initialWeight}
                                onChange={e => setFormData({ ...formData, initialWeight: e.target.value })}
                                className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-2 focus:ring-tea-200 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">Price (CNY)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-2 focus:ring-tea-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">{t('inventory.fields.date')}</label>
                            <input
                                type="date"
                                value={formData.purchaseDate}
                                onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                                className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-2 focus:ring-tea-200 outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Notes */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('inventory.fields.notes')}</label>
                    <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-2 focus:ring-tea-200 outline-none resize-none"
                        placeholder={t('inventory.placeholders.notes')}
                    />
                </section>

                <button
                    type="submit"
                    className="w-full bg-tea-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-tea-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Save size={20} />
                    <span>Save Changes</span>
                </button>
            </form>
        </div>
    );
};

export default EditTea;
