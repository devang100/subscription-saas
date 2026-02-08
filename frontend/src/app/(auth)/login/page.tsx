'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const [error, setError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            setError('');
            await login(data);
            router.push('/dashboard');
        } catch (e: any) {
            setError(e.response?.data?.message || 'Login failed');
        }
    };

    return (

        <div className="flex min-h-screen bg-white dark:bg-zinc-950">
            {/* Left Decoration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 items-center justify-center p-12">
                <div className="absolute inset-0 bg-indigo-600/20 z-10" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-20" />

                {/* Abstract Orbs */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-3xl" />

                <div className="relative z-30 max-w-lg text-white">
                    <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/50">
                        <span className="text-2xl font-bold">S</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome back to Stratis.</h1>
                    <p className="text-lg text-gray-300">
                        The intelligent OS for your agency. Manage less, do more.
                    </p>
                </div>
            </div>

            {/* Right Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">S</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h2>
                    </div>

                    <div className="hidden lg:block mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your credentials to access your workspace.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                {...register('email')}
                                type="email"
                                required
                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                            <input
                                {...register('password')}
                                type="password"
                                required
                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isSubmitting ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        New to Stratis? <Link href="/register" className="text-indigo-600 font-medium hover:text-indigo-500 hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
