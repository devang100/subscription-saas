'use client';

import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Folder, Calendar } from 'lucide-react';

export default function ClientDetailsPage() {
    const { orgId, clientId } = useParams();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        if (clientId) {
            fetchProjects();
        }
    }, [clientId]);

    const fetchProjects = () => {
        api.get(`/clients/${clientId}/projects`)
            .then(res => {
                setProjects(res.data.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/clients/${clientId}/projects`, formData);
            setShowModal(false);
            setFormData({ name: '', description: '' });
            fetchProjects();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create project');
        }
    };

    return (
        <div className="flex-1 p-10 overflow-auto h-full">
            {/* Header */}
            <div className="mb-8">
                <Link href={`/dashboard/${orgId}/clients`} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1 mb-4 text-sm font-medium transition-colors">
                    <ArrowLeft size={16} /> Back to Clients
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage projects for this client.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2 shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 transition-all"
                    >
                        <Plus size={18} />
                        <span>New Project</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-300 dark:border-zinc-800">
                    <Folder className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No active projects</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Start a new campaign or website project for this client.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(proj => (
                        <Link
                            href={`/dashboard/${orgId}/projects/${proj.id}`}
                            key={proj.id}
                            className="block group"
                        >
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all h-full flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Folder size={20} />
                                    </div>
                                    <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                        {proj.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 mb-2 transition-colors">
                                    {proj.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{proj.description || 'No description provided.'}</p>

                                <div className="border-t pt-4 flex justify-between items-center bg-gray-50/30 -mx-6 -mb-6 p-4 mt-auto rounded-b-xl border-gray-100">
                                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <span className="font-bold text-gray-700">{proj._count?.tasks || 0}</span> Tasks
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar size={12} /> {new Date(proj.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-[400px] shadow-2xl animate-in zoom-in-95 border border-gray-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Project</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Website Redesign"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none h-24 transition-all bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief details..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 transition-colors"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
