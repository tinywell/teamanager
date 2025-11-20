import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTeas } from '../hooks/useTeas';
import { useBrewLogs } from '../hooks/useBrewLogs';
import BrewTimer from '../components/BrewTimer';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NewBrew = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedTeaId = searchParams.get('teaId');
    const { t } = useTranslation();

    const { teas } = useTeas();
    const { addLog } = useBrewLogs();

    const [formData, setFormData] = useState({
        teaId: preselectedTeaId || '',
        waterTemp: 95,
        steepTime: 0,
        teaAmount: 5,
        rating: 0,
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.teaId) return;

        addLog({
            teaId: formData.teaId,
            date: new Date().toISOString(),
            waterTemp: formData.waterTemp,
            steepTime: formData.steepTime,
            teaAmount: formData.teaAmount,
            rating: formData.rating,
            tastingNotes: formData.notes.split(',').map(n => n.trim()).filter(Boolean)
        });
        navigate('/journal');
    };

    return (
        <div className="animate-fade-in pt-4 pb-20">
            <header className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-stone-600" />
                </button>
                <h1 className="text-2xl font-serif font-bold text-ink">{t('journal.newBrew')}</h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tea Selection */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                    <label className="block text-sm font-bold text-stone-700 mb-2">{t('journal.selectTea')}</label>
                    <select
                        required
                        value={formData.teaId}
                        onChange={e => setFormData({ ...formData, teaId: e.target.value })}
                        className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-2 focus:ring-tea-200 outline-none"
                    >
                        <option value="">{t('journal.chooseTea')}</option>
                        {teas.map(tea => (
                            <option key={tea.id} value={tea.id}>{tea.name} ({tea.type})</option>
                        ))}
                    </select>
                </section>

                {/* Timer */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                    <h2 className="text-sm font-bold text-stone-700 mb-4">{t('journal.timer')}</h2>
                    <div className="flex justify-center mb-4">
                        <BrewTimer onComplete={(time) => setFormData(prev => ({ ...prev, steepTime: time }))} />
                    </div>
                    <p className="text-xs text-center text-stone-400">{t('journal.timerHint')}</p>
                </section>

                {/* Parameters */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1">{t('journal.fields.temp')}</label>
                            <input
                                type="number"
                                value={formData.waterTemp}
                                onChange={e => setFormData({ ...formData, waterTemp: Number(e.target.value) })}
                                className="w-full p-3 bg-stone-50 rounded-lg text-center font-medium focus:ring-2 focus:ring-tea-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1">{t('journal.fields.time')}</label>
                            <input
                                type="number"
                                value={formData.steepTime}
                                onChange={e => setFormData({ ...formData, steepTime: Number(e.target.value) })}
                                className="w-full p-3 bg-stone-50 rounded-lg text-center font-medium focus:ring-2 focus:ring-tea-200 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1">{t('journal.fields.amount')}</label>
                            <input
                                type="number"
                                value={formData.teaAmount}
                                onChange={e => setFormData({ ...formData, teaAmount: Number(e.target.value) })}
                                className="w-full p-3 bg-stone-50 rounded-lg text-center font-medium focus:ring-2 focus:ring-tea-200 outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Rating */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                    <label className="block text-sm font-bold text-stone-700 mb-2">{t('journal.fields.rating')}</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: star })}
                                className={`text-2xl transition-transform hover:scale-110 ${star <= formData.rating ? 'text-yellow-400' : 'text-stone-200'
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </section>

                {/* Notes */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                    <label className="block text-sm font-bold text-stone-700 mb-1">{t('journal.fields.notes')}</label>
                    <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-2 focus:ring-tea-200 outline-none resize-none"
                        placeholder={t('journal.placeholders.notes')}
                    />
                </section>

                <button
                    type="submit"
                    className="w-full bg-tea-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-tea-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Save size={20} />
                    <span>{t('journal.logBrew')}</span>
                </button>
            </form>
        </div>
    );
};

export default NewBrew;
