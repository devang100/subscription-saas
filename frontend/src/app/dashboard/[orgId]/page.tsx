'use client';

import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Activity, Users, Briefcase, Layout, ArrowRight } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function OrgDashboard() {
    const { orgId } = useParams();
    const { user } = useAuthStore();

    const [loading, setLoading] = useState(true);
    const [org, setOrg] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orgId) {
            fetchData();
        }
    }, [orgId]);

    const fetchData = async () => {
        try {
            const [orgRes, statsRes] = await Promise.all([
                api.get(`/organizations/${orgId}`),
                api.get(`/organizations/${orgId}/stats`)
            ]);
            setOrg(orgRes.data.data);
            setStats(statsRes.data.data);
        } catch (error: any) {
            console.error('Failed to load dashboard', error);
            setError(error.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !org || !stats) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 flex-col gap-4">
                <div className="text-red-500 font-medium">Unable to load dashboard</div>
                <p className="text-gray-500 text-sm">{error || 'Organization data missing'}</p>
                <Link href="/dashboard" className="text-indigo-600 hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    // Prepare Chart Data
    const taskData = [
        { name: 'To Do', value: stats.taskDistribution.TODO || 0, color: '#f3f4f6', text: '#374151' },
        { name: 'In Progress', value: stats.taskDistribution.IN_PROGRESS || 0, color: '#3b82f6', text: '#ffffff' },
        { name: 'Review', value: stats.taskDistribution.REVIEW || 0, color: '#eab308', text: '#ffffff' },
        { name: 'Done', value: stats.taskDistribution.DONE || 0, color: '#22c55e', text: '#ffffff' },
    ].filter(d => d.value > 0);

    const formatActivity = (action: string) => {
        return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="flex-1 p-10 overflow-auto h-full">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, here's what's happening at {org.name}.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="bg-white dark:bg-zinc-900 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-800 shadow-sm">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                <Breadcrumbs
                    items={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: org.name }
                    ]}
                />

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Plan"
                        value={org.subscription?.status === 'active'
                            ? (org.subscription.planId === 'PRO' ? 'Pro' : org.subscription.planId === 'ENTERPRISE' ? 'Enterprise' : 'Free')
                            : 'Free'}
                        icon={<Briefcase size={20} />}
                    />
                    <StatsCard
                        title="Active Clients"
                        value={stats.clientCount}
                        icon={<Users size={20} />}
                        trend={{ value: "+2", positive: true }} // Mock trend
                    />
                    <StatsCard
                        title="Projects"
                        value={stats.projectCount}
                        icon={<Layout size={20} />}
                    />
                    <StatsCard
                        title="Activity"
                        value={stats.recentActivity.length.toString()}
                        icon={<Activity size={20} />}
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <button className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all text-left group">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Briefcase size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">New Project</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Start a new project</p>
                    </button>
                    <button className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:border-green-500 dark:hover:border-green-500 hover:shadow-md transition-all text-left group">
                        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <Users size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Add Client</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Register a new client</p>
                    </button>
                    <button className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all text-left group">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Users size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Invite Team</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Send invitations</p>
                    </button>
                    <button className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md transition-all text-left group">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Activity size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Generate Report</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Export analytics</p>
                    </button>
                </div>

                {/* Chart & Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Task Distribution */}
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100/80 dark:border-zinc-800 p-6 flex flex-col">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                            Task Distribution
                        </h3>
                        {taskData.length > 0 ? (
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={taskData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {taskData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                        />
                                        <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-10">
                                <Layout className="w-12 h-12 mb-3 opacity-20" />
                                <p>No tasks found.</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100/80 dark:border-zinc-800 p-6 flex flex-col h-full">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-pink-500 rounded-full"></span>
                            Recent Activity
                        </h3>
                        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {stats.recentActivity.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">No recent activity.</p>
                            ) : (
                                stats.recentActivity.map((log: any) => (
                                    <div key={log.id} className="flex gap-3 items-start">
                                        <div className="mt-1 min-w-[32px] w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-zinc-900">
                                            {log.user?.fullName?.[0] || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                <span className="font-semibold">{log.user?.fullName || 'System'}</span>
                                                {' '}{Date.now() - new Date(log.createdAt).getTime() < 86400000 ? 'just' : ''} {formatActivity(log.action).toLowerCase()}
                                                {' '}<span className="font-medium text-indigo-600 dark:text-indigo-400">{log.entity}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-50">
                            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1">
                                View Full Audit Log <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
