'use client';

import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Activity, Search, Filter, Download, Calendar, User, AlertCircle } from 'lucide-react';

export default function ActivityPage() {
    const { orgId } = useParams();
    const [logs, setLogs] = useState<any[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAction, setFilterAction] = useState<string>('all');

    useEffect(() => {
        if (orgId) {
            api.get(`/organizations/${orgId}/audit-logs`)
                .then(res => {
                    setLogs(res.data.data);
                    setFilteredLogs(res.data.data);
                    setLoading(false);
                })
                .catch(console.error);
        }
    }, [orgId]);

    useEffect(() => {
        let filtered = logs;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(log =>
                log.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.entity?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply action filter
        if (filterAction !== 'all') {
            filtered = filtered.filter(log => log.action === filterAction);
        }

        setFilteredLogs(filtered);
    }, [searchQuery, filterAction, logs]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const formatFullDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getActionBadgeColor = (action: string) => {
        if (action.includes('CREATE')) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
        if (action.includes('UPDATE')) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
        if (action.includes('DELETE')) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
    };

    const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

    return (
        <div className="flex-1 p-10 overflow-auto h-full bg-gray-50 dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                Track all actions and changes in your organization
                            </p>
                        </div>
                    </div>
                </div>

                <Breadcrumbs
                    items={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Activity Logs' }
                    ]}
                />

                {/* Filters and Search */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by user, action, or entity..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>

                        {/* Filter by Action */}
                        <div className="relative min-w-[200px]">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <select
                                value={filterAction}
                                onChange={(e) => setFilterAction(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-gray-900 dark:text-white"
                            >
                                <option value="all">All Actions</option>
                                {uniqueActions.map(action => (
                                    <option key={action} value={action}>{action}</option>
                                ))}
                            </select>
                        </div>

                        {/* Export Button */}
                        <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm hover:shadow-md">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>

                    {/* Results count */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredLogs.length}</span> of <span className="font-semibold text-gray-700 dark:text-gray-300">{logs.length}</span> activities
                        </p>
                    </div>
                </div>

                {/* Activity Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <AlertCircle className="w-12 h-12 text-gray-300 dark:text-zinc-600 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No activity found</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                {searchQuery || filterAction !== 'all'
                                    ? 'Try adjusting your filters or search query'
                                    : 'No activity has been recorded yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                                <thead className="bg-gray-50 dark:bg-zinc-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5" />
                                                User
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Entity</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            <div className="flex items-center justify-end gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Time
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-100 dark:divide-zinc-800">
                                    {filteredLogs.map((log: any) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                        {log.user?.fullName?.[0] || 'S'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {log.user?.fullName || 'System'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {log.user?.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${getActionBadgeColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {log.entity}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={log.details}>
                                                {log.details ? (
                                                    <span className="font-mono text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                                        {JSON.stringify(JSON.parse(log.details))}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-600">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm text-gray-900 dark:text-white font-medium">
                                                    {formatDate(log.createdAt)}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatFullDate(log.createdAt)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
