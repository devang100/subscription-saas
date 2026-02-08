'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useSocket } from '@/hooks/useSocket';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data.notifications);
            setUnreadCount(res.data.data.unreadCount);
        } catch (error) {
            console.error(error);
        }
    };

    const socket = useSocket();

    useEffect(() => {
        fetchNotifications();
        // const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        // return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('notification_new', (newNotif: any) => {
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
        });
        return () => {
            socket.off('notification_new');
        };
    }, [socket]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        try {
            await api.patch(`/notifications/${id}/read`);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) { console.error(error); }
    };

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) { console.error(error); }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all outline-none"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 flex justify-between items-center backdrop-blur-sm">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-200 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                                <Bell size={24} className="opacity-20" />
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`p-4 border-b dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group ${!n.isRead ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                                    <div className="flex gap-3 items-start">
                                        <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${!n.isRead ? 'bg-indigo-600 shadow-sm' : 'bg-transparent'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">{n.title}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                                            <div className="flex gap-3 pt-2 items-center justify-between">
                                                <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                <div className="flex gap-2">
                                                    {n.link && (
                                                        <Link href={n.link} className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300" onClick={() => setIsOpen(false)}>
                                                            View
                                                        </Link>
                                                    )}
                                                    {!n.isRead && (
                                                        <button onClick={(e) => markAsRead(n.id, e)} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Mark read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
