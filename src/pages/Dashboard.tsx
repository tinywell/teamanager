import { Link } from 'react-router-dom';
import { useTeas } from '../hooks/useTeas';
import { useBrewLogs } from '../hooks/useBrewLogs';
import { Leaf, Droplets, Timer, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TeaStats from '../components/TeaStats';

const Dashboard = () => {
    const { teas } = useTeas();
    const { logs } = useBrewLogs();
    const { t } = useTranslation();

    const lastBrew = logs[0];
    const lastBrewTea = lastBrew ? teas.find(t => t.id === lastBrew.teaId) : null;

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="flex justify-between items-center pt-4">
                <div>
                    <p className="text-stone-500 text-sm font-medium">{t('common.goodMorning')},</p>
                    <h1 className="text-2xl font-serif text-ink-dark font-bold">{t('common.teaLover')}</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-tea-100 flex items-center justify-center text-tea-600">
                    <Leaf size={20} />
                </div>
            </header>

            {/* Current Brew Card */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-tea-500 to-tea-700 text-white shadow-lg p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-medium mb-2">
                                {lastBrew ? t('dashboard.lastBrewed') : t('dashboard.readyToBrew')}
                            </span>
                            <h2 className="text-2xl font-serif">{lastBrewTea?.name || t('dashboard.startJourney')}</h2>
                            <p className="text-tea-100 text-sm">{lastBrewTea?.type ? t(`teaTypes.${lastBrewTea.type}`) : t('dashboard.pickTea')}</p>
                        </div>
                    </div>

                    {lastBrew ? (
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <Droplets size={18} className="text-tea-200" />
                                <span className="font-medium">{lastBrew.waterTemp}°C</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Timer size={18} className="text-tea-200" />
                                <span className="font-medium">{lastBrew.steepTime}s</span>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/inventory"
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                        >
                            <Plus size={18} />
                            <span>{t('dashboard.browseCellar')}</span>
                        </Link>
                    )}
                </div>
            </section>

            {/* Stats */}
            <TeaStats />

            {/* Recent Activity */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-serif font-bold text-ink">{t('dashboard.recentLogs')}</h3>
                    <Link to="/journal" className="text-xs text-tea-600 font-medium hover:underline">{t('dashboard.viewAll')}</Link>
                </div>
                <div className="space-y-3">
                    {logs.slice(0, 3).map((log) => {
                        const tea = teas.find(t => t.id === log.teaId);
                        return (
                            <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                                        <Leaf size={16} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-ink">{tea?.name || t('common.unknown')}</p>
                                        <p className="text-xs text-stone-400">{new Date(log.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400 text-xs">
                                    {'★'.repeat(log.rating)}
                                </div>
                            </div>
                        );
                    })}
                    {logs.length === 0 && (
                        <p className="text-stone-400 text-sm text-center py-4">{t('dashboard.noActivity')}</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
