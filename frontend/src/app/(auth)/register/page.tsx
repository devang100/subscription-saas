'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

export default function RegisterPage() {
    const { register: registerAuth } = useAuthStore();
    const router = useRouter();
    const { register, handleSubmit } = useForm();
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

        <div className="flex min-h-screen bg-white dark:bg-zinc-950">
            {/* Left Decoration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 items-center justify-center p-12 order-2">
                <div className="absolute inset-0 bg-violet-600/20 z-10" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-20" />

                {/* Abstract Orbs */}
                <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-indigo-500/30 to-violet-500/30 blur-3xl" />

                <div className="relative z-30 max-w-lg text-white text-right">
                    <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center mb-8 ml-auto shadow-2xl shadow-violet-500/50">
                        <span className="text-2xl font-bold">S</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Join the future of work.</h1>
                    <p className="text-lg text-gray-300">
                        Create an account to start managing your agency with Stratis intelligent tools.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative order-1">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">S</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                    </div>

                    <div className="hidden lg:block mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Get started with your free organization</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input
                                {...register('fullName')}
                                type="text"
                                required
                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="John Doe"
                            />
                        </div>
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                {...register('password')}
                                type="password"
                                required
                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Name (Optional)</label>
                            <input
                                {...register('orgName')}
                                type="text"
                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="Acme Inc."
                            />
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 mt-4">
                            Sign Up
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account? <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-500 hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
