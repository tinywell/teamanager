import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useTeas } from '../hooks/useTeas';
import { useBrewLogs } from '../hooks/useBrewLogs';
import { useTranslation } from 'react-i18next';

const COLORS = ['#8A9A5B', '#D2B48C', '#8B4513', '#F5F5DC', '#A0522D', '#6B8E23', '#DAA520'];

type DateRange = '7d' | '30d' | 'all';

const TeaStats = () => {
    const { teas } = useTeas();
    const { logs } = useBrewLogs();
    const { t } = useTranslation();
    const [dateRange, setDateRange] = useState<DateRange>('7d');

    // Filter logs by date range
    const filteredLogs = useMemo(() => {
        if (dateRange === 'all') return logs;

        const now = new Date();
        const daysAgo = dateRange === '7d' ? 7 : 30;
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        return logs.filter(log => new Date(log.date) >= cutoffDate);
    }, [logs, dateRange]);

    // 1. Inventory Distribution by Type
    const typeData = useMemo(() => {
        const counts: Record<string, number> = {};
        teas.forEach(tea => {
            counts[tea.type] = (counts[tea.type] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [teas]);

    // 2. Brewing Activity
    const activityData = useMemo(() => {
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const dateArray = Array.from({ length: days }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const counts: Record<string, number> = {};
        filteredLogs.forEach(log => {
            const date = log.date.split('T')[0];
            counts[date] = (counts[date] || 0) + 1;
        });

        return dateArray.map(date => ({
            date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            count: counts[date] || 0
        }));
    }, [filteredLogs, dateRange]);

    // 3. Total Tea Consumed
    const totalTeaConsumed = useMemo(() => {
        return filteredLogs.reduce((sum, log) => sum + (log.teaAmount || 0), 0);
    }, [filteredLogs]);

    if (teas.length === 0 && logs.length === 0) return null;

    return (
        <div className="space-y-6">
            {/* Date Range Selector */}
            <div className="flex justify-center gap-2">
                <button
                    onClick={() => setDateRange('7d')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateRange === '7d' ? 'bg-tea-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                >
                    {t('stats.last7Days')}
                </button>
                <button
                    onClick={() => setDateRange('30d')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateRange === '30d' ? 'bg-tea-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                >
                    {t('stats.last30Days')}
                </button>
                <button
                    onClick={() => setDateRange('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateRange === 'all' ? 'bg-tea-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                >
                    {t('stats.allTime')}
                </button>
            </div>

            {/* Tea Consumption Metric */}
            {totalTeaConsumed > 0 && (
                <div className="bg-gradient-to-br from-tea-500 to-tea-600 p-6 rounded-xl shadow-sm text-white">
                    <p className="text-sm opacity-90 mb-1">{t('stats.totalConsumed')}</p>
                    <p className="text-4xl font-serif font-bold">{totalTeaConsumed}g</p>
                </div>
            )}

            {/* Inventory Distribution */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                <h3 className="font-serif font-bold text-ink mb-4">{t('stats.inventoryDistribution')}</h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={typeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {typeData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {typeData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1 text-xs text-stone-500">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span>{t(`teaTypes.${entry.name}`)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Brewing Activity */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                <h3 className="font-serif font-bold text-ink mb-4">{t('stats.weeklyActivity')}</h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={{ fill: '#f5f5f4' }} />
                            <Bar dataKey="count" fill="#8A9A5B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TeaStats;
