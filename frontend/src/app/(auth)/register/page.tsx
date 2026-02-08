'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Mail, Lock, User, Building2, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const { register: registerAuth } = useAuthStore();
    const router = useRouter();
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const [error, setError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            setError('');
            await registerAuth(data);
            router.push('/dashboard');
        } catch (e: any) {
            console.error(e);
            setError(e.response?.data?.message || e.message || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-zinc-950 font-sans">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative order-1">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Layers className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Agency OS</span>
                    </div>

                    <div className="text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Start your 14-day free trial. No credit card required.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <input
                                        {...register('fullName')}
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Work Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        {...register('password')}
                                        type="password"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Organization Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <input
                                        {...register('orgName')}
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                                        placeholder="Acme Inc."
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating account...' : 'Create Account'}
                                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer Copyright */}
                <div className="absolute bottom-6 text-xs text-gray-400 dark:text-gray-600">
                    &copy; {new Date().getFullYear()} Agency OS. All rights reserved.
                </div>
            </div>

            {/* Right Side: Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 items-center justify-center overflow-hidden order-2">
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-zinc-900 animate-gradient-xy" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 max-w-lg px-8 text-center lg:text-left">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-xl">
                        <Layers className="text-white w-8 h-8" />
                    </div>

                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Manage your agency <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                            like a pro.
                        </span>
                    </h1>

                    <div className="space-y-4 text-lg text-gray-300/90 font-light">
                        <p className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                            Unlimited projects and tasks
                        </p>
                        <p className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                            Client portal with custom branding
                        </p>
                        <p className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                            Automated invoicing & payments
                        </p>
                    </div>

                    {/* Testimonial Card */}
                    <div className="mt-12 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                        <p className="text-gray-200 italic mb-4">
                            "Agency OS effectively replaced 4 different tools we were using. It keeps our entire team and clients synced."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500" />
                            <div>
                                <p className="text-white font-medium text-sm">Sarah Chen</p>
                                <p className="text-gray-400 text-xs">Founder, DesignCo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
