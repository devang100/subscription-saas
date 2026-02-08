'use client';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

import { useState } from 'react';
import { api } from '@/lib/api';

export function Footer() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');
        const fd = new FormData(e.currentTarget);
        const email = fd.get('email');

        try {
            await api.post('/newsletter/subscribe', { email });
            setStatus('success');
            // Reset after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    }

    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                                S
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Stratis
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                            The intelligent platform for scaling your agency. Experience clarity in every workflow.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="/features" className="hover:text-indigo-600 dark:hover:text-indigo-400">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</Link></li>
                            <li><Link href="/changelog" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Changelog</Link></li>
                            <li><Link href="/docs" className="hover:text-indigo-600 dark:hover:text-indigo-400">Documentation</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-indigo-600 dark:hover:text-indigo-400">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-gray-100 dark:border-zinc-800 pt-10 md:pt-0 md:pl-10">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6">Stay Updated</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Subscribe to our newsletter for the latest updates.
                        </p>
                        <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                disabled={status === 'loading' || status === 'success'}
                                className="w-full px-4 py-2 rounded-lg bg-indigo-600 disabled:bg-indigo-400 text-white font-medium text-sm hover:bg-indigo-700 transition-colors"
                            >
                                {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
                            </button>
                            {status === 'error' && <p className="text-red-500 text-xs">Failed to subscribe. Try again.</p>}
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} Stratis. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/legal/privacy" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link>
                        <Link href="/legal/terms" className="hover:text-gray-900 dark:hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
