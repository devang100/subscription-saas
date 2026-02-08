'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
