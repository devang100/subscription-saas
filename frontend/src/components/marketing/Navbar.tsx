'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/marketing/ThemeToggle';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
// import { cn } from '@/lib/utils'; // Removed to use local definition
// I'll create a local utility for now if needed, but usually I should check if @/lib/utils exists.
// I'll assume standard shadcn/ui utils or similar usage. simpler to just use clsx/tailwind-merge inline or imports.
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export function Navbar() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
            scrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-gray-200 dark:border-zinc-800 py-3" : "bg-transparent py-5"
        )}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                        S
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Stratis
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Features
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        About
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Pricing
                    </Link>
                    <Link href="/blog" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Blog
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <div className="flex items-center gap-4 md:hidden">
                    <ThemeToggle />
                    <button className="text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 p-6 flex flex-col gap-4 shadow-xl">
                    <Link href="/features" className="text-lg font-medium text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                    <Link href="/about" className="text-lg font-medium text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>About</Link>
                    <Link href="/pricing" className="text-lg font-medium text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                    <Link href="/blog" className="text-lg font-medium text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                    <hr className="border-gray-100 dark:border-zinc-800 my-2" />
                    <Link href="/login" className="text-lg font-medium text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link href="/register" className="text-lg font-medium text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                </div>
            )}
        </nav>
    );
}
