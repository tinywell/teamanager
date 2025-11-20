
import { Link } from 'react-router-dom';
import { useBrewLogs } from '../hooks/useBrewLogs';
import { useTeas } from '../hooks/useTeas';
import { Plus, Calendar, Clock, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Journal = () => {
    const { logs } = useBrewLogs();
    const { teas } = useTeas();
    const { t } = useTranslation();

    const getTeaName = (id: string) => teas.find(t => t.id === id)?.name || t('common.unknown');

    return (
        <div className="animate-fade-in pt-4 pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-serif font-bold text-ink">{t('journal.title')}</h1>
                <Link to="/journal/new" className="w-10 h-10 rounded-full bg-tea-500 text-white flex items-center justify-center shadow-lg hover:bg-tea-600 transition-colors">
                    <Plus size={24} />
                </Link>
            </div>

            <div className="space-y-4">
                {logs.length === 0 ? (
                    <div className="text-center py-12 text-stone-400">
                        <p>{t('journal.noLogs')}</p>
                        <p className="text-sm mt-2">{t('journal.startBrewing')}</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-serif font-bold text-ink text-lg">{getTeaName(log.teaId)}</h3>
                                <div className="text-yellow-400 text-xs">
                                    {'★'.repeat(log.rating)}
                                </div>
                            </div>

                            <div className="flex gap-4 text-xs text-stone-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    <span>{new Date(log.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Droplets size={12} />
                                    <span>{log.waterTemp}°C</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>{log.steepTime}s</span>
                                </div>
                                {log.teaAmount && (
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-xs">G</span>
                                        <span>{log.teaAmount}g</span>
                                    </div>
                                )}
                            </div>

                            {log.tastingNotes.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {log.tastingNotes.map((note, i) => (
                                        <span key={i} className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] rounded-full">
                                            {note}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Journal;
