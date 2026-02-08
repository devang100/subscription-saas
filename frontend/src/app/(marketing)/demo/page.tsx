'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle2, Users, BarChart3, Calendar, MessageSquare } from 'lucide-react';

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900">
            {/* Header */}
            <div className="container mx-auto px-6 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                        🎥 Interactive Demo
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                        See Stratis in Action
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                        Explore how Stratis helps agencies manage projects, clients, and teams with ease.
                    </p>

                    {/* Video Placeholder */}
                    <div className="max-w-5xl mx-auto mb-20">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 bg-gray-900 aspect-video">
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-600">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto cursor-pointer hover:bg-white/30 transition-all">
                                        <Play className="w-10 h-10 text-white ml-1" />
                                    </div>
                                    <p className="text-white text-lg font-medium">Watch Demo Video</p>
                                    <p className="text-white/80 text-sm mt-2">Coming Soon - 3 min overview</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Key Features Grid */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
                        What You'll See in the Demo
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: 'Multi-Organization Management',
                                description: 'Create and manage multiple workspaces with role-based access control'
                            },
                            {
                                icon: Calendar,
                                title: 'Visual Kanban Boards',
                                description: 'Drag-and-drop task management with real-time updates'
                            },
                            {
                                icon: BarChart3,
                                title: 'Analytics & Reporting',
                                description: 'Track project progress, team performance, and revenue metrics'
                            },
                            {
                                icon: MessageSquare,
                                title: 'Team Collaboration',
                                description: 'Comments, notifications, and real-time updates for your team'
                            },
                            {
                                icon: CheckCircle2,
                                title: 'Client Management',
                                description: 'Organize clients, projects, and deliverables in one place'
                            },
                            {
                                icon: Play,
                                title: 'Time Tracking',
                                description: 'Log hours, track billable time, and generate invoices'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-center"
                            >
                                <feature.icon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4 mx-auto" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-20 p-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Join hundreds of agencies already using Stratis to streamline their operations.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="px-8 py-4 rounded-full bg-white text-indigo-600 font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-4 rounded-full border-2 border-white text-white font-semibold text-lg hover:bg-white/10 transition-all hover:-translate-y-1"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
