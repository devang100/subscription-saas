'use client';

import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
    const router = useRouter();
    const { user: authUser, setUser } = useAuthStore();
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

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
        setMessage('');
        try {
            const res = await api.patch('/users/me', {
                fullName,
                password: password || undefined // Only send if changed
            });
            if (authUser) {
                setUser({ ...authUser, fullName: res.data.data.fullName }); // Update store
            }
            setMessage('Profile updated successfully!');
            setPassword(''); // Clear password field
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 flex-col">

            {/* Header (Simplified) */}
            <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
                <div className="font-bold text-xl">SaaS App</div>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Back to Dashboard</Link>
            </header>

            <div className="flex-1 p-10 max-w-2xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                disabled
                                value={authUser?.email || ''}
                                className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Leave blank to keep current password"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
