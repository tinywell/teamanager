
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ScrollText, Package, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const { t } = useTranslation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/', icon: Home, label: t('nav.home') },
        { path: '/journal', icon: ScrollText, label: t('nav.journal') },
        { path: '/inventory', icon: Package, label: t('nav.cellar') },
        { path: '/profile', icon: User, label: t('nav.profile') },
    ];

    return (
        <div className="min-h-screen bg-stone-50 pb-24 relative overflow-hidden">
            {/* Background decoration */}
            <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-tea-100/50 to-transparent -z-10 pointer-events-none" />

            <main className="max-w-md mx-auto min-h-screen px-4 py-6">
                {children}
            </main>

            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md border border-stone-200 rounded-2xl shadow-lg z-50">
                <div className="flex justify-around items-center p-3">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={clsx(
                                "flex flex-col items-center gap-1 transition-colors duration-300 p-2 rounded-xl",
                                isActive(path)
                                    ? "text-tea-600 bg-tea-50"
                                    : "text-stone-400 hover:text-tea-500"
                            )}
                        >
                            <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default Layout;

