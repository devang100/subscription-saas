'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Layers, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Validation Schema
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setServerError('');
            await login(data);
            router.push('/dashboard');
        } catch (e: any) {
            setServerError(e.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-zinc-950 font-sans">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative order-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Layers className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Agency OS</span>
                    </div>

                    <div className="text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Enter your credentials to access your workspace.
                        </p>
                    </div>

                    {serverError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-900/30 flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            {serverError}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 dark:border-red-800 focus:ring-red-500' : 'border-gray-300 dark:border-zinc-700 focus:ring-indigo-500'} rounded-lg bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm`}
                                        placeholder="name@company.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        {...register('password')}
                                        type={showPassword ? "text" : "password"}
                                        className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300 dark:border-red-800 focus:ring-red-500' : 'border-gray-300 dark:border-zinc-700 focus:ring-indigo-500'} rounded-lg bg-gray-50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-zinc-950 text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                    <path
                                        d="M12.0003 20.4499C16.6669 20.4499 20.5836 16.5332 20.5836 11.8666C20.5836 7.1999 16.6669 3.2832 12.0003 3.2832C7.3336 3.2832 3.41693 7.1999 3.41693 11.8666C3.41693 16.1499 6.5836 19.6999 10.6669 20.3332V14.3332H8.46693V11.8666H10.6669V9.9332C10.6669 7.76654 11.9669 6.56654 13.9336 6.56654C14.8669 6.56654 15.8503 6.7332 15.8503 6.7332V8.86654H14.7669C13.6836 8.86654 13.3336 9.5332 13.3336 10.2332V11.8666H15.7003L15.3169 14.3332H13.3336V20.3332C17.3836 19.6832 20.5836 16.1332 20.5836 11.8666Z"
                                        fill="#1877F2"
                                        fillOpacity="0"
                                    />
                                    <path
                                        d="M12.0003 20.45C16.6669 20.45 20.5836 16.5333 20.5836 11.8667C20.5836 7.20002 16.6669 3.28336 12.0003 3.28336C7.3336 3.28336 3.41693 7.20002 3.41693 11.8667C3.41693 16.15 6.5836 19.7 10.6669 20.3334V14.3334H8.46693V11.8667H10.6669V9.93336C10.6669 7.76669 11.9669 6.56669 13.9336 6.56669C14.8669 6.56669 15.8503 6.73336 15.8503 6.73336V8.86669H14.7669C13.6836 8.86669 13.3336 9.53336 13.3336 10.2334V11.8667H15.7003L15.3169 14.3334H13.3336V20.3334C17.3836 19.6834 20.5836 16.1334 20.5836 11.8667Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <span className="text-sm font-semibold leading-6">GitHub</span>
                            </button>

                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="text-sm font-semibold leading-6">Google</span>
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        New to Agency OS?{' '}
                        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
                            Create an account
                        </Link>
                    </p>
                </motion.div>

                {/* Footer Copyright */}
                <div className="absolute bottom-6 text-xs text-gray-400 dark:text-gray-600">
                    &copy; {new Date().getFullYear()} Agency OS. All rights reserved.
                </div>
            </div>

            {/* Right Side: Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 items-center justify-center overflow-hidden order-2">
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900 via-purple-900 to-zinc-900 animate-gradient-xy" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                {/* Decorative Elements */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"
                />

                <div className="relative z-10 max-w-lg px-8 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-xl">
                            <Layers className="text-white w-8 h-8" />
                        </div>

                        <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Welcome back to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                                Agency OS.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-300/90 font-light mb-8 leading-relaxed">
                            Your agency's command center is ready. Log in to track projects, manage clients, and grow your business.
                        </p>
                    </motion.div>

                    {/* Testimonial Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-12 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
                    >
                        <p className="text-gray-200 italic mb-4">
                            "The best decision we made for our agency. Agency OS helped us scale from 5 to 50 employees without the chaos."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    src="/images/devang.png"
                                    alt="Devang Patel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">Devang Patel</p>
                                <p className="text-gray-400 text-xs">Founder & CEO</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
