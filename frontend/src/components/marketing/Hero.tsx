'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                        ✨ introducing: Stratis
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
                        Manage your agency <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                            with superpowers.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The all-in-one platform to manage projects, clients, and billing.
                        Stop juggling multiple tools and start scaling your business today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Link
                            href="/register"
                            className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/demo"
                            className="px-8 py-4 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold text-lg hover:border-gray-400 dark:hover:border-zinc-600 transition-all hover:-translate-y-1"
                        >
                            View Demo
                        </Link>
                    </div>
                </motion.div>

                {/* Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="relative max-w-6xl mx-auto"
                    style={{ perspective: '1000px' }}
                >
                    <div className="relative rounded-xl bg-gray-900/5 dark:bg-white/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 lg:rounded-2xl lg:p-4 backdrop-blur-sm">


                        <div className="rounded-md overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 aspect-[16/9] flex items-center justify-center relative group">
                            <Image
                                src="/hero-dashboard.png"
                                alt="Dashboard Preview"
                                fill
                                className="object-cover rounded-md"
                                priority
                            />
                        </div>

                        {/* Floating elements (Parallax feel) */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-10 top-10 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-xl border border-gray-100 dark:border-zinc-700 hidden md:block"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">$</div>
                                <div>
                                    <p className="text-xs text-gray-500">Revenue</p>
                                    <p className="font-bold text-gray-900 dark:text-white">$12,450</p>
                                </div>
                            </div>
                            <div className="h-1 w-32 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full w-[70%] bg-green-500" />
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -left-10 bottom-20 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-xl border border-gray-100 dark:border-zinc-700 hidden md:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">✓</div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Task Completed</p>
                                    <p className="text-xs text-gray-500">Website Redesign</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
