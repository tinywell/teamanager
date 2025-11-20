import { useState, useEffect } from 'react';
import type { BrewLog } from '../types';
import { syncBrewLogsToCloud, fetchBrewLogsFromCloud } from '../utils/cloudSync';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'brewLogs';

export const useBrewLogs = () => {
    const [logs, setLogs] = useState<BrewLog[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });
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
                const cloudLogs = await fetchBrewLogsFromCloud();

                if (cloudLogs.length > 0) {
                    const localLogs = logs;
                    const mergedLogs = [...cloudLogs];

                    // Add local logs that don't exist in cloud
                    localLogs.forEach(localLog => {
                        if (!cloudLogs.find(cl => cl.id === localLog.id)) {
                            mergedLogs.push(localLog);
                        }
                    });

                    setLogs(mergedLogs);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedLogs));

                    // Sync local-only logs to cloud
                    if (mergedLogs.length > cloudLogs.length) {
                        await syncBrewLogsToCloud(mergedLogs);
                    }
                }
            } catch (error) {
                console.error('Failed to load brew logs from cloud:', error);
            }
        };

        loadFromCloud();
    }, [user]); // Only run when user changes

    // Sync to cloud whenever logs change (if authenticated)
    useEffect(() => {
        if (!user || logs.length === 0) return;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

        // Debounce cloud sync
        const timer = setTimeout(() => {
            syncBrewLogsToCloud(logs);
        }, 1000);

        return () => clearTimeout(timer);
    }, [logs, user]);

    const addLog = (log: Omit<BrewLog, 'id'>) => {
        const newLog = { ...log, id: crypto.randomUUID() };
        setLogs(prev => [newLog, ...prev]);
    };

    return { logs, addLog };
};
