import { useState, useEffect } from 'react';
import type { Tea } from '../types';
import { syncTeasToCloud, fetchTeasFromCloud, deleteTeaFromCloud } from '../utils/cloudSync';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'teas';

export const useTeas = () => {
    const [teas, setTeas] = useState<Tea[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
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

    // Load from cloud on mount (if authenticated)
    useEffect(() => {
        if (!user) return;

        const loadFromCloud = async () => {
            try {
                setIsSyncing(true);
                const cloudTeas = await fetchTeasFromCloud();

                if (cloudTeas.length > 0) {
                    // Merge cloud data with local data
                    const localTeas = teas;
                    const mergedTeas = [...cloudTeas];

                    // Add local teas that don't exist in cloud
                    localTeas.forEach(localTea => {
                        if (!cloudTeas.find(ct => ct.id === localTea.id)) {
                            mergedTeas.push(localTea);
                        }
                    });

                    setTeas(mergedTeas);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedTeas));

                    // Sync local-only teas to cloud
                    if (mergedTeas.length > cloudTeas.length) {
                        await syncTeasToCloud(mergedTeas);
                    }
                }

                setLastSyncTime(new Date());
            } catch (error) {
                console.error('Failed to load from cloud:', error);
            } finally {
                setIsSyncing(false);
            }
        };

        loadFromCloud();
    }, [user]); // Only run when user changes

    // Sync to cloud whenever teas change (if authenticated)
    useEffect(() => {
        if (!user || teas.length === 0) return;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(teas));

        // Debounce cloud sync
        const timer = setTimeout(() => {
            syncTeasToCloud(teas).then(() => {
                setLastSyncTime(new Date());
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, [teas, user]);

    const addTea = (tea: Omit<Tea, 'id'>) => {
        const newTea = { ...tea, id: crypto.randomUUID() };
        setTeas(prev => [newTea, ...prev]);
    };

    const updateTea = (id: string, updates: Partial<Tea>) => {
        setTeas(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTea = async (id: string) => {
        setTeas(prev => prev.filter(t => t.id !== id));
        if (user) {
            await deleteTeaFromCloud(id);
        }
    };

    const syncNow = async () => {
        if (!user) return;

        setIsSyncing(true);
        try {
            await syncTeasToCloud(teas);
            setLastSyncTime(new Date());
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    return { teas, addTea, updateTea, deleteTea, isSyncing, lastSyncTime, syncNow };
};
