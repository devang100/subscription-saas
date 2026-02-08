import { Features } from '@/components/marketing/Features';

export default function FeaturesPage() {
    return (
        <div className="pt-10">
            <div className="text-center py-16 bg-indigo-50 dark:bg-zinc-900/50">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Platform Features</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Explore what makes Agency OS unique.</p>
            </div>
            <Features />
        </div>
    );
}
