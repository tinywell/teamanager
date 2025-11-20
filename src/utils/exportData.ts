import { get, keys } from 'idb-keyval';

export interface BackupData {
    version: string;
    exportDate: string;
    teas: any[];
    brewLogs: any[];
    images: Record<string, string>; // blobId -> base64
}

/**
 * Convert Blob to Base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Export all data to JSON file
 */
export async function exportData(): Promise<void> {
    try {
        // Get teas from localStorage
        const teasJson = localStorage.getItem('teas');
        const teas = teasJson ? JSON.parse(teasJson) : [];

        // Get brew logs from localStorage
        const logsJson = localStorage.getItem('brewLogs');
        const brewLogs = logsJson ? JSON.parse(logsJson) : [];

        // Get all images from IndexedDB
        const imageKeys = await keys();
        const images: Record<string, string> = {};

        for (const key of imageKeys) {
            if (typeof key === 'string' && key.startsWith('tea-image-')) {
                const blob = await get(key);
                if (blob instanceof Blob) {
                    images[key] = await blobToBase64(blob);
                }
            }
        }

        // Create backup object
        const backup: BackupData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            teas,
            brewLogs,
            images
        };

        // Convert to JSON string
        const jsonString = JSON.stringify(backup, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tea-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export failed:', error);
        throw new Error('Failed to export data');
    }
}
