'use client';

import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { AIAssistant } from '@/components/AIAssistant';
import { Building2 } from 'lucide-react';
import { CreateOrgModal } from '@/components/CreateOrgModal';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout() {
    const [orgs, setOrgs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        api.get('/organizations/me')
            .then(res => {
                setOrgs(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch orgs', err);
                setLoading(false);
                // router.push('/login');
            });
    }, []);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-8 transition-colors">
                <div className="max-w-5xl mx-auto">
                    <Breadcrumbs items={[{ label: 'Dashboard' }]} />

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Workspaces</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your organizations and projects.</p>
                        </div>
                        <CreateOrgModal>
                            <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                            >
                                <span className="text-xl leading-none">+</span> Create Organization
                            </button>
                        </CreateOrgModal>
                    </div>

                    {loading ? (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-40 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : orgs.length === 0 ? (
                        <EmptyState
                            icon={Building2}
                            title="No organizations yet"
                            description="Create your first organization to get started with Stratis."
                            action={{ label: "Create Organization", onClick: () => { } }}
                        />
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {orgs.map((m: any) => (
                                <Link
                                    key={m.organization.id}
                                    href={`/dashboard/${m.organization.id}`}
                                >
                                    <Card className="h-full hover:border-indigo-500 transition-colors group cursor-pointer">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                                    {m.organization.name[0]}
                                                </div>
                                                <Badge variant="secondary" className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                                                    {m.role.name}
                                                </Badge>
                                            </div>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                {m.organization.name}
                                            </h3>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 truncate font-mono bg-gray-50 dark:bg-zinc-900/50 inline-block px-2 py-0.5 rounded">
                                                {m.organization.slug}
                                            </p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* New Empty State and Quick Actions */}
                    {orgs.length > 0 && ( // Only show this if there are organizations
                        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Welcome to Agency OS empty state */}
                            <div className="flex flex-col items-center justify-center py-10 text-center bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">👋</span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Welcome to Agency OS!</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                                    It looks like you're new here. Start by adding your first client to manage their projects.
                                </p>
                                {/* Assuming orgId is available from the first organization if there are any */}
                                {orgs.length > 0 && (
                                    <Link
                                        href={`/dashboard/${orgs[0].organization.id}/clients`}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                    >
                                        + Add First Client
                                    </Link>
                                )}
                            </div>

                            {/* Quick Actions Support */}
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    {orgs.length > 0 && (
                                        <>
                                            <Link href={`/dashboard/${orgs[0].organization.id}/clients`} className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition group">
                                                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Add New Client</span>
                                            </Link>
                                            <Link href={`/dashboard/${orgs[0].organization.id}/users`} className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition group">
                                                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Invite Team Member</span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Global AI Assistant */}
                <AIAssistant />
            </div>
            );
}
