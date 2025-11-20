import { set } from 'idb-keyval';
import type { BackupData } from './exportData';

/**
 * Convert Base64 string to Blob
 */
function base64ToBlob(base64: string): Blob {
    const parts = base64.split(',');
    const contentType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

/**
 * Import data from JSON backup file
 */
export async function importData(file: File, mode: 'merge' | 'replace' = 'merge'): Promise<void> {
    try {
        // Read file
        const text = await file.text();
        const backup: BackupData = JSON.parse(text);

        // Validate version
        if (backup.version !== '1.0') {
            throw new Error('Unsupported backup version');
        }

        // Handle replace mode
        if (mode === 'replace') {
            localStorage.removeItem('teas');
            localStorage.removeItem('brewLogs');
            // Note: We don't clear IndexedDB images to avoid breaking existing references
        }

        // Import teas
        const existingTeasJson = localStorage.getItem('teas');
        const existingTeas = existingTeasJson ? JSON.parse(existingTeasJson) : [];

        if (mode === 'merge') {
            // Merge: avoid duplicates by ID
            const existingIds = new Set(existingTeas.map((t: any) => t.id));
            const newTeas = backup.teas.filter((t: any) => !existingIds.has(t.id));
            localStorage.setItem('teas', JSON.stringify([...existingTeas, ...newTeas]));
        } else {
            localStorage.setItem('teas', JSON.stringify(backup.teas));
        }

        // Import brew logs
        const existingLogsJson = localStorage.getItem('brewLogs');
        const existingLogs = existingLogsJson ? JSON.parse(existingLogsJson) : [];

        if (mode === 'merge') {
            const existingIds = new Set(existingLogs.map((l: any) => l.id));
            const newLogs = backup.brewLogs.filter((l: any) => !existingIds.has(l.id));
            localStorage.setItem('brewLogs', JSON.stringify([...existingLogs, ...newLogs]));
        } else {
            localStorage.setItem('brewLogs', JSON.stringify(backup.brewLogs));
        }

        // Import images
        for (const [blobId, base64] of Object.entries(backup.images)) {
            const blob = base64ToBlob(base64);
            await set(blobId, blob);
        }

        // Reload page to refresh data
        window.location.reload();
    } catch (error) {
        console.error('Import failed:', error);
        throw new Error('Failed to import data. Please check the file format.');
    }
}
