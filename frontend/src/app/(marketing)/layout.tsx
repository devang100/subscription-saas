import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 selection:bg-indigo-100 dark:selection:bg-indigo-900">
            <Navbar />
            <main className="flex-1 pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
