'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, fetchUser, isLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const verify = async () => {
            if (typeof window === 'undefined') return;

            const token = localStorage.getItem('accessToken');

            if (!token) {
                // No token, must login
                console.log('No token found, redirecting to login');
                setChecked(false);
                router.replace('/login');
                return;
            }

            if (!user) {
                try {
                    await fetchUser();
                    setChecked(true);
                } catch (error) {
                    console.error('Failed to fetch user in guard', error);
                    localStorage.removeItem('accessToken');
                    setChecked(false);
                    router.replace('/login');
                    return;
                }
            } else {
                setChecked(true);
            }
        };

        verify();
    }, [pathname, user, router, fetchUser]); // Re-verify when pathname or user changes

    // Listen for storage changes (e.g., logout in another tab or manual token removal)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'accessToken' && !e.newValue) {
                // Token was removed, force re-check
                console.log('Token removed, forcing re-verification');
                setChecked(false);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // While checking initial token presence or fetching user
    if (!checked && !user) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // If check complete but no user (and no token handled above), render nothing until redirect happens
    if (checked && !user) return null;

    return <>{children}</>;
}
