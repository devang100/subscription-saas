'use client';

import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export default function MyTasksPage() {
    const { orgId } = useParams();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orgId) {
            api.get(`/organizations/${orgId}/my-tasks`)
                .then(res => {
                    setTasks(res.data.data);
                    setLoading(false);
                })
                .catch(console.error);
        }
    }, [orgId]);

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'HIGH': return 'bg-red-100 text-red-800';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
            case 'LOW': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (s: string) => {
        switch (s) {
            case 'DONE': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-blue-500" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="flex-1 p-10 overflow-auto h-full">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Tasks</h1>

            {loading ? (
                <div className="text-gray-500 dark:text-gray-400">Loading tasks...</div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <CheckCircle className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">You have no tasks assigned to you.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">{getStatusIcon(task.status)}</div>
                                <div>
                                    <h3 className={`font-semibold text-lg ${task.status === 'DONE' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                                        {task.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span>{task.project.client.name}</span>
                                        <span>•</span>
                                        <span>{task.project.name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                                <Link
                                    href={`/dashboard/${orgId}/projects/${task.project.id}`}
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 text-sm font-medium"
                                >
                                    View Board <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
