import { supabase } from '../lib/supabase';
import type { Tea, BrewLog } from '../types';

/**
 * Sync teas to cloud (user-based)
 */
export async function syncTeasToCloud(teas: Tea[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const tea of teas) {
        const { error } = await supabase
            .from('teas')
            .upsert({
                id: tea.id,
                user_id: user.id,
                name: tea.name,
                type: tea.type,
                origin: tea.origin,
                stock_weight: tea.stockWeight,
                purchase_date: tea.purchaseDate,
                rating: tea.rating,
                notes: tea.notes,
                image_blob_id: tea.imageBlobId
            }, {
                onConflict: 'id'
            });

        if (error) {
            console.error('Failed to sync tea:', error);
        }
    }
}

/**
 * Sync brew logs to cloud (user-based)
 */
export async function syncBrewLogsToCloud(logs: BrewLog[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    for (const log of logs) {
        const { error } = await supabase
            .from('brew_logs')
            .upsert({
                id: log.id,
                user_id: user.id,
                tea_id: log.teaId,
                date: log.date,
                water_temp: log.waterTemp,
                steep_time: log.steepTime,
                tea_amount: log.teaAmount,
                rating: log.rating,
                tasting_notes: log.tastingNotes
            }, {
                onConflict: 'id'
            });

        if (error) {
            console.error('Failed to sync brew log:', error);
        }
    }
}

/**
 * Fetch teas from cloud for current user
 */
export async function fetchTeasFromCloud(): Promise<Tea[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('teas')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Failed to fetch teas:', error);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        origin: row.origin,
        stockWeight: row.stock_weight,
        purchaseDate: row.purchase_date,
        rating: row.rating,
        notes: row.notes,
        imageBlobId: row.image_blob_id
    }));
}

/**
 * Fetch brew logs from cloud for current user
 */
export async function fetchBrewLogsFromCloud(): Promise<BrewLog[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('brew_logs')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Failed to fetch brew logs:', error);
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        teaId: row.tea_id,
        date: row.date,
        waterTemp: row.water_temp,
        steepTime: row.steep_time,
        teaAmount: row.tea_amount,
        rating: row.rating,
        tastingNotes: row.tasting_notes || []
    }));
}

/**
 * Delete tea from cloud
 */
export async function deleteTeaFromCloud(teaId: string): Promise<void> {
    const { error } = await supabase
        .from('teas')
        .delete()
        .eq('id', teaId);

    if (error) {
        console.error('Failed to delete tea from cloud:', error);
    }
}

/**
 * Delete brew log from cloud
 */
export async function deleteBrewLogFromCloud(logId: string): Promise<void> {
    const { error } = await supabase
        .from('brew_logs')
        .delete()
        .eq('id', logId);

    if (error) {
        console.error('Failed to delete brew log from cloud:', error);
    }
}
