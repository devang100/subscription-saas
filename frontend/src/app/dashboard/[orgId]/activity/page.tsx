'use client';

import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function ActivityPage() {
    const { orgId } = useParams();
    const { user } = useAuthStore();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ... (rest of useEffect)
    useEffect(() => {
        if (orgId) {
            api.get(`/organizations/${orgId}/audit-logs`)
                .then(res => {
                    setLogs(res.data.data);
                    setLoading(false);
                })
                .catch(console.error);
        }
    }, [orgId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar (Copy-pasted for now since no layout) */}
            <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col hidden md:flex">
                <div className="font-bold text-xl text-gray-800 mb-8">Agency OS</div>
                <nav className="flex-1 space-y-1">
                    <Link href={`/dashboard/${orgId}`} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Overview</Link>
                    <Link href={`/dashboard/${orgId}/my-tasks`} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">My Tasks</Link>
                    <Link href={`/dashboard/${orgId}/clients`} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Clients</Link>
                    <Link href={`/dashboard/${orgId}/users`} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Team</Link>
                    <Link href={`/dashboard/${orgId}/billing`} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Billing</Link>
                    <Link href={`/dashboard/${orgId}/settings`} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Settings</Link>
                    <Link href={`/dashboard/${orgId}/activity`} className="block px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg font-medium">Activity</Link>
                </nav>

                <div className="border-t pt-4">
                    <Link href="/dashboard/profile" className="block text-sm font-medium text-gray-900 hover:text-indigo-600 mb-1">
                        {user?.fullName || 'User'} (Edit)
                    </Link>
                    <Link href="/login" className="text-xs text-gray-500 hover:text-gray-700">Log out</Link>
                </div>
            </div>

            <div className="flex-1 p-10 overflow-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity Logs</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map((log: any) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {log.user?.fullName || 'System'}
                                        <span className="block text-xs text-gray-500 font-normal">{log.user?.email}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{log.action}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.entity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={log.details}>
                                        {log.details ? JSON.stringify(JSON.parse(log.details)) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                        {formatDate(log.createdAt)}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        No activity recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
