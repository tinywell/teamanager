import { useState, useEffect, useCallback } from 'react';
import type { BrewLog } from '../types';
import { supabase } from '../lib/supabase';

export const useBrewLogs = () => {
    const [logs, setLogs] = useState<BrewLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    // Check auth status
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchLogs = useCallback(async () => {
        if (!user) {
            setLogs([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('brew_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) throw error;

            const mappedLogs: BrewLog[] = (data || []).map(row => ({
                id: row.id,
                teaId: row.tea_id,
                date: row.date,
                waterTemp: row.water_temp,
                steepTime: row.steep_time,
                teaAmount: row.tea_amount,
                rating: row.rating,
                tastingNotes: row.tasting_notes || []
            }));

            setLogs(mappedLogs);
        } catch (err: any) {
            console.error('Error fetching brew logs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initial fetch
    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const addLog = async (log: Omit<BrewLog, 'id'>) => {
        if (!user) return;
        const newId = crypto.randomUUID();

        try {
            const { error } = await supabase
                .from('brew_logs')
                .insert({
                    id: newId,
                    user_id: user.id,
                    tea_id: log.teaId,
                    date: log.date,
                    water_temp: log.waterTemp,
                    steep_time: log.steepTime,
                    tea_amount: log.teaAmount,
                    rating: log.rating,
                    tasting_notes: log.tastingNotes
                });

            if (error) throw error;
            await fetchLogs(); // Refresh list
        } catch (err: any) {
            console.error('Error adding brew log:', err);
            setError(err.message);
            throw err;
        }
    };

    return { logs, loading, error, addLog, refreshLogs: fetchLogs };
};
