import Link from 'next/link';
import { ArrowRight, MapPin, Briefcase } from 'lucide-react';

export default function CareersPage() {
    return (
        <div className="py-20 bg-gray-50 dark:bg-zinc-950 min-h-screen">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Join our team
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        We're on a mission to build the operating system for the next generation of agencies. Come help us shape the future of work.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-gray-100 dark:border-zinc-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Open Positions</h2>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {[
                            { title: 'Senior Full Stack Engineer', location: 'Remote', type: 'Full-time', dept: 'Engineering' },
                            { title: 'Product Designer', location: 'New York, NY', type: 'Full-time', dept: 'Design' },
                            { title: 'Growth Marketing Manager', location: 'Remote', type: 'Full-time', dept: 'Marketing' },
                        ].map((job, i) => (
                            <div key={i} className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Briefcase size={14} /> {job.dept}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} /> {job.location}
                                        </span>
                                        <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs uppercase tracking-wide font-medium">
                                            {job.type}
                                        </span>
                                    </div>
                                </div>
                                <ArrowRight className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-500">
                        Don't see a role that fits? <a href="mailto:careers@stratis.com" className="text-indigo-600 hover:underline">Email us</a> your resume.
                    </p>
                </div>
            </div>
        </div>
    );
}
