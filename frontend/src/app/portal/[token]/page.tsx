'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ThemeToggle } from '@/components/ThemeToggle';

// Use a separate axios instance or just direct axios to avoid interceptors if needed, 
// though standard api instance is fine if it handles 401 gracefully or if we don't send token.
const API_URL = 'http://localhost:4000/api';

export default function ClientPortalPage() {
    const { token } = useParams();
    const [client, setClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            axios.get(`${API_URL}/portal/${token}`)
                .then(res => {
                    setClient(res.data.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Invalid or expired portal link');
                    setLoading(false);
                });
        }
    }, [token]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 text-gray-500 dark:text-gray-400">Loading portal...</div>;
    if (error) return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 text-red-500">{error}</div>;
    if (!client) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 font-sans">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-8 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                        {client.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{client.name}</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Client Portal</p>
                    </div>
                </div>
                <ThemeToggle />
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Projects Overview</h2>
                    <p className="text-gray-500 dark:text-gray-400">Track the progress of your active projects.</p>
                </div>

                <div className="grid gap-8">
                    {client.projects.map((project: any) => (
                        <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-1">{project.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.description || 'No description'}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${project.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="p-6">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Recent Tasks</h4>
                                <div className="space-y-3">
                                    {project.tasks.slice(0, 5).map((task: any) => (
                                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800/50">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${task.status === 'DONE' ? 'bg-green-500' :
                                                        task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-zinc-600'
                                                    }`} />
                                                <span className={`text-sm font-medium ${task.status === 'DONE' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-200'}`}>
                                                    {task.title}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400 font-mono">{task.status.replace('_', ' ')}</span>
                                        </div>
                                    ))}
                                    {project.tasks.length === 0 && (
                                        <p className="text-sm text-gray-400 italic">No tasks yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {client.projects.length === 0 && (
                        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700">
                            <p className="text-gray-500 dark:text-gray-400">No active projects found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
