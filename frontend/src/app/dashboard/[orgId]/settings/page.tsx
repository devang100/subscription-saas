'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { Save, Trash2, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const { orgId } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({ name: '', slug: '' });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (orgId) {
            fetchOrg();
        }
    }, [orgId]);

    const fetchOrg = async () => {
        try {
            const res = await api.get(`/organizations/${orgId}`);
            const { name, slug } = res.data.data;
            setFormData({ name, slug });
        } catch (error) {
            console.error('Failed to fetch org', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await api.patch(`/organizations/${orgId}`, formData);
            setMessage({ type: 'success', text: 'Organization updated successfully.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update organization.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you absolutely sure?\n\nThis action cannot be undone. This will permanently delete the organization, all projects, tasks, and data.')) {
            return;
        }

        // Double confirm key
        const confirmName = window.prompt(`To confirm, type "${formData.name}"`);
        if (confirmName !== formData.name) {
            alert('Organization name did not match.');
            return;
        }

        setDeleting(true);
        try {
            await api.delete(`/organizations/${orgId}`);
            router.push('/dashboard'); // Or select another org
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete organization');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 p-10 overflow-auto">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your organization preferences and configuration.</p>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200/60 dark:border-zinc-800 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Information</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your organization details.</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Organization Name</label>
                                <input
                                    type="text"
                                    required
                                    className="block w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Organization Slug</label>
                                <div className="flex rounded-lg shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 sm:text-sm">
                                        agencyos.com/
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border transition-all"
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">This is your unique namespace in the application.</p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-medium shadow-sm shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden">
                    <div className="p-6 border-b border-red-50 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10">
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </h3>
                        <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">Irreversible actions for your organization.</p>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Permanently delete this organization, including all associated projects, tasks, clients, and membership data. This action cannot be undone.
                        </p>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-white dark:bg-zinc-800 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete Organization
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
