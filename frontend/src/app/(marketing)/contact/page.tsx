'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');

        const fd = new FormData(e.currentTarget);
        const data = Object.fromEntries(fd.entries());

        try {
            await api.post('/contact', data);
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    }

    return (
        <div className="py-20 bg-gray-50 dark:bg-zinc-950 min-h-screen">
            <div className="container mx-auto px-6 max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Get in touch</h1>
                    <p className="text-gray-500 mb-8">We'd love to hear from you.</p>

                    {status === 'success' ? (
                        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
                            Message sent! We'll get back to you shortly.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                <input name="name" required className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input name="email" type="email" required className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea name="message" required rows={4} className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <button
                                disabled={status === 'loading'}
                                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Message'}
                            </button>
                            {status === 'error' && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
