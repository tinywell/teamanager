import { useState, useEffect, useCallback } from 'react';
import type { Tea } from '../types';
import { supabase } from '../lib/supabase';

export const useTeas = () => {
    const [teas, setTeas] = useState<Tea[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

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

    const fetchTeas = useCallback(async () => {
        if (!user) {
            setTeas([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('teas')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mappedTeas: Tea[] = (data || []).map(row => ({
                id: row.id,
                name: row.name,
                type: row.type,
                origin: row.origin,
                vendor: row.vendor,
                stockWeight: row.stock_weight,
                initialWeight: row.initial_weight,
                purchaseDate: row.purchase_date,
                price: row.price,
                rating: row.rating,
                notes: row.notes,
                imageBlobId: row.image_blob_id
            }));

            setTeas(mappedTeas);
            setLastSyncTime(new Date());
        } catch (err: any) {
            console.error('Error fetching teas:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initial fetch
    useEffect(() => {
        fetchTeas();
    }, [fetchTeas]);

    const addTea = async (tea: Omit<Tea, 'id'>) => {
        if (!user) return;
        const newId = crypto.randomUUID();

        try {
            const { error } = await supabase
                .from('teas')
                .insert({
                    id: newId,
                    user_id: user.id,
                    name: tea.name,
                    type: tea.type,
                    origin: tea.origin,
                    vendor: tea.vendor,
                    stock_weight: tea.stockWeight,
                    initial_weight: tea.initialWeight,
                    purchase_date: tea.purchaseDate,
                    price: tea.price,
                    rating: tea.rating,
                    notes: tea.notes,
                    image_blob_id: tea.imageBlobId
                });

            if (error) throw error;
            await fetchTeas(); // Refresh list
        } catch (err: any) {
            console.error('Error adding tea:', err);
            setError(err.message);
            throw err;
        }
    };

    const updateTea = async (id: string, updates: Partial<Tea>) => {
        if (!user) return;

        try {
            // Map frontend fields to DB columns
            const dbUpdates: any = {};
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.type !== undefined) dbUpdates.type = updates.type;
            if (updates.origin !== undefined) dbUpdates.origin = updates.origin;
            if (updates.vendor !== undefined) dbUpdates.vendor = updates.vendor;
            if (updates.stockWeight !== undefined) dbUpdates.stock_weight = updates.stockWeight;
            if (updates.initialWeight !== undefined) dbUpdates.initial_weight = updates.initialWeight;
            if (updates.purchaseDate !== undefined) dbUpdates.purchase_date = updates.purchaseDate;
            if (updates.price !== undefined) dbUpdates.price = updates.price;
            if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
            if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
            if (updates.imageBlobId !== undefined) dbUpdates.image_blob_id = updates.imageBlobId;

            const { error } = await supabase
                .from('teas')
                .update(dbUpdates)
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            await fetchTeas(); // Refresh list
        } catch (err: any) {
            console.error('Error updating tea:', err);
            setError(err.message);
            throw err;
        }
    };

    const deleteTea = async (id: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('teas')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            await fetchTeas(); // Refresh list
        } catch (err: any) {
            console.error('Error deleting tea:', err);
            setError(err.message);
            throw err;
        }
    };

    return {
        teas,
        loading,
        error,
        addTea,
        updateTea,
        deleteTea,
        refreshTeas: fetchTeas,
        isSyncing: loading,
        lastSyncTime,
        syncNow: fetchTeas
    };
};
