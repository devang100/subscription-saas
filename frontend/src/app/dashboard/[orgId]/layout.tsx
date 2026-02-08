'use client';

import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { CommandPalette } from '@/components/CommandPalette';
import { ThemeToggle } from '@/components/ThemeToggle';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors">
                <Sidebar />
                <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                    <CommandPalette />
                    {/* Global Topbar */}
                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 px-8 py-3 flex justify-between items-center shrink-0 h-16 z-10 sticky top-0 transition-colors">
                        {/* Search Trigger Hint */}
                        <div
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 transition-all"
                            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                        >
                            <span>Search...</span>
                            <kbd className="hidden sm:inline-block px-1.5 font-sans text-[10px] font-medium text-gray-500 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded shadow-sm">⌘K</kbd>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <div className="h-6 w-px bg-gray-200 dark:bg-zinc-800"></div>
                            <NotificationBell />
                        </div>
                    </div>

                    {/* Page Content */}
                    <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
