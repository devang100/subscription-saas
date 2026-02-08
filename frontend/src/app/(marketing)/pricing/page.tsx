import { Pricing } from '@/components/marketing/Pricing';

export default function PricingPage() {
    return (
        <div className="pt-10">
            <div className="text-center py-16 bg-gray-50 dark:bg-zinc-900/50">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Pricing Plans</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Flexible plans for teams of all sizes.</p>
            </div>
            <Pricing />
        </div>
    );
}
