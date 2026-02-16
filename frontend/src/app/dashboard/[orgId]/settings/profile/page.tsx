'use client';

import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, User, Key, Save, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { user: authUser, setUser } = useAuthStore();
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/users/me')
            .then(res => {
                setFullName(res.data.data.fullName || '');
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setSaving(true);
        try {
            const res = await api.patch('/users/me', {
                fullName,
                password: password || undefined // Only send if changed
            });
            if (authUser) {
                setUser({ ...authUser, fullName: res.data.data.fullName }); // Update store
            }
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setPassword(''); // Clear password field
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 p-10 overflow-auto">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your personal information and security settings.</p>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Personal Details
                        </h2>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    disabled
                                    value={authUser?.email || ''}
                                    className="block w-full border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 rounded-lg shadow-sm sm:text-sm p-2.5 border cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-400 mt-1.5">Email address cannot be changed for security reasons.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="block w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border transition-all"
                                />
                            </div>

                            <div className="border-t border-gray-100 dark:border-zinc-800 pt-6 mt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Key className="w-5 h-5" />
                                    Security
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Leave blank to keep current password"
                                        className="block w-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border transition-all"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Must be at least 6 characters long.</p>
                                </div>
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
            </div>
        </div>
    );
}
