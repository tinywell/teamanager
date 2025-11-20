import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Upload, AlertCircle, CheckCircle, Cloud, LogOut, User } from 'lucide-react';
import { exportData } from '../utils/exportData';
import { importData } from '../utils/importData';
import { useTeas } from '../hooks/useTeas';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { t, i18n } = useTranslation();
    const { user, signOut } = useAuth();
    const { isSyncing, lastSyncTime, syncNow } = useTeas();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'zh' : 'en';
        i18n.changeLanguage(newLang);
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            setStatus(null);
            await exportData();
            setStatus({ type: 'success', message: t('profile.exportSuccess') });
        } catch (error) {
            setStatus({ type: 'error', message: t('profile.exportError') });
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsImporting(true);
            setStatus(null);
            await importData(file, 'merge');
            setStatus({ type: 'success', message: t('profile.importSuccess') });
        } catch (error) {
            setStatus({ type: 'error', message: t('profile.importError') });
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            setStatus({ type: 'error', message: 'Logout failed' });
        }
    };

    return (
        <div className="animate-fade-in pt-4 pb-20">
            <h1 className="text-2xl font-serif font-bold text-ink mb-6">{t('nav.profile')}</h1>

            {/* Status Message */}
            {status && (
                <div className={`mb-4 p-4 rounded-xl flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="text-sm">{status.message}</p>
                </div>
            )}

            {/* User Info */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 mb-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-tea-100 rounded-full flex items-center justify-center">
                        <User size={24} className="text-tea-600" />
                    </div>
                    <div>
                        <p className="font-bold text-ink">{user?.email}</p>
                        <p className="text-xs text-stone-500">{t('profile.loggedIn')}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                    <LogOut size={18} />
                    <span>{t('auth.logout')}</span>
                </button>
            </div>

            {/* Cloud Sync Status */}
            <div className="bg-gradient-to-br from-tea-500 to-tea-600 p-4 rounded-xl shadow-sm text-white mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Cloud size={20} />
                        <h2 className="font-bold">{t('profile.cloudSync')}</h2>
                    </div>
                    {isSyncing && (
                        <div className="animate-spin">
                            <Cloud size={16} />
                        </div>
                    )}
                </div>
                <p className="text-sm opacity-90">
                    {lastSyncTime
                        ? `${t('profile.lastSync')}: ${lastSyncTime.toLocaleTimeString()}`
                        : t('profile.notSynced')}
                </p>
                <button
                    onClick={syncNow}
                    disabled={isSyncing}
                    className="mt-3 w-full py-2 px-4 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {isSyncing ? t('profile.syncing') : t('profile.syncNow')}
                </button>
            </div>

            {/* Language Settings */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 mb-4">
                <h2 className="font-bold text-ink mb-4">{t('profile.settings')}</h2>
                <button
                    onClick={toggleLanguage}
                    className="w-full py-3 px-4 bg-stone-50 rounded-lg flex justify-between items-center hover:bg-stone-100 transition-colors"
                >
                    <span className="text-stone-600">{t('profile.language')}</span>
                    <span className="font-medium text-tea-600 uppercase">{i18n.language}</span>
                </button>
            </div>

            {/* Data Backup */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                <h2 className="font-bold text-ink mb-2">{t('profile.dataBackup')}</h2>
                <p className="text-sm text-stone-500 mb-4">{t('profile.backupDescription')}</p>

                <div className="space-y-3">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full py-3 px-4 bg-tea-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-tea-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Download size={20} />
                        <span>{isExporting ? t('profile.exporting') : t('profile.exportData')}</span>
                    </button>

                    <button
                        onClick={handleImportClick}
                        disabled={isImporting}
                        className="w-full py-3 px-4 bg-stone-100 text-stone-700 rounded-lg flex items-center justify-center gap-2 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Upload size={20} />
                        <span>{isImporting ? t('profile.importing') : t('profile.importData')}</span>
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                <p className="text-xs text-stone-400 mt-4">
                    {t('profile.backupNote')}
                </p>
            </div>
        </div>
    );
};

export default Profile;
