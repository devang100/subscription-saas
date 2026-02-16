'use client';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Settings, Briefcase, CheckSquare, LogOut, BarChart3 } from 'lucide-react';

export default function Sidebar() {
    const { orgId } = useParams();
    const pathname = usePathname();
    const { user } = useAuthStore();

    // Helper to determine active state
    const isActive = (path: string, exact = false) => {
        if (!pathname) return false;
        if (exact) return pathname === path;
        return pathname.startsWith(path);
    };

    const navItems = [
        { href: `/dashboard/${orgId}`, label: 'Overview', icon: LayoutDashboard, exact: true },
        { href: `/dashboard/${orgId}/my-tasks`, label: 'My Tasks', icon: CheckSquare },
        { href: `/dashboard/${orgId}/clients`, label: 'Clients', icon: Users },
        { href: `/dashboard/${orgId}/users`, label: 'Team', icon: Briefcase },
        { href: `/dashboard/${orgId}/reports`, label: 'Reports', icon: BarChart3 },
        { href: `/dashboard/${orgId}/billing`, label: 'Billing', icon: CreditCard },
        { href: `/dashboard/${orgId}/settings`, label: 'Settings', icon: Settings },
    ];

    if (!orgId) return null; // Don't render if no org context

    return (
        <div className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-6 flex flex-col hidden md:flex h-full transition-colors">
            <div className="font-bold text-xl text-gray-900 dark:text-white mb-8 flex items-center gap-3 px-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-indigo-200 dark:shadow-none shadow-md">S</div>
                <span className="tracking-tight">Stratis</span>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map(item => {
                    const active = isActive(item.href, item.exact);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                ${active
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <item.icon size={18} className={`transition-colors ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 mt-auto">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors group cursor-pointer mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                        {user?.fullName?.[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <Link href={`/dashboard/${orgId}/settings/profile`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-indigo-600 px-2 py-1 transition-colors">
                    <div className="flex items-center gap-2">
                        <Users size={14} /> Profile
                    </div>
                </Link>
                <Link href="/login" className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-600 px-2 py-1 transition-colors">
                    <LogOut size={14} /> Log out
                </Link>
            </div>
        </div>
    );
}
