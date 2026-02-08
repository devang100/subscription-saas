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
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                // No token found, redirect immediately
                if (pathname !== '/login' && pathname !== '/register') {
                    router.push('/login');
                }
                return;
            }

            if (!user) {
                // Token exists but user not loaded, fetch user
                try {
                    await fetchUser();
                } catch (error) {
                    localStorage.removeItem('accessToken');
                    router.push('/login');
                }
            }
            setChecked(true);
        };

        checkAuth();
    }, [user, fetchUser, router, pathname]);

    // Show nothing while checking authentication to prevent flash of protected content
    if (!checked && !user) {
        return null;
    }

    // If still loading user profile but key exists, show loading check
    if (isLoading && !user) {
        // Optional: Spinner here
        return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>;
    }

    return <>{children}</>;
}
