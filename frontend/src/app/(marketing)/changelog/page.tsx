import { Badge } from 'lucide-react';
import { Tag, Calendar } from 'lucide-react';

export default function ChangelogPage() {
    return (
        <div className="py-20 container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Changelog</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">Stay updated with the latest improvements.</p>
            </div>

            <div className="space-y-12">
                {[1, 2].map((_, i) => (
                    <div key={i} className="flex gap-8 relative group">
                        {/* Timeline */}
                        <div className="hidden sm:flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-4 shrink-0 border border-indigo-200 dark:border-indigo-800 z-10 relative">
                                v2.{2 - i}
                            </div>
                            <div className="flex-1 w-0.5 bg-gray-200 dark:bg-zinc-800 -mt-2"></div>
                        </div>

                        <div className="flex-1 pb-12">
                            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative">
                                <span className="absolute top-8 right-8 text-sm text-gray-400 flex items-center gap-2">
                                    <Calendar size={14} /> {i === 0 ? 'Jan 17, 2026' : 'Dec 12, 2025'}
                                </span>

                                <div className="sm:hidden mb-4 flex items-center gap-2 text-indigo-600 font-bold">
                                    v2.{2 - i} <span className="text-gray-400 font-normal text-sm ml-auto">{i === 0 ? 'Jan 17, 2026' : 'Dec 12, 2025'}</span>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    {i === 0 ? 'Introducing Stratis Rebrand' : 'Performance Improvements'}
                                </h2>

                                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                                    <p>
                                        {i === 0
                                            ? "We are excited to unveil our new identity: Stratis. This update brings a completely new marketing website, improved dashboard UI, and a smarter core engine."
                                            : "We've optimized the query performance by 40% and crushed some pesky bugs in the task management module."}
                                    </p>

                                    <ul className="space-y-2 mt-4">
                                        {[1, 2, 3].map((j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                                <span>
                                                    {i === 0
                                                        ? ["Complete UI overhaul with glassmorphism", "New Marketing Site with 3D elements", "Enhanced mobile responsiveness"][j - 1]
                                                        : ["Fixed Kanban drag-and-drop issues", "Faster page loads for large projects", "Improved PDF report generation"][j - 1]}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                                        <Tag size={12} /> New
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                                        <Tag size={12} /> Improvement
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
