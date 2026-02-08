import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    trend?: {
        value: string;
        positive: boolean;
    };
    icon?: React.ReactNode;
}

export function StatsCard({ title, value, trend, icon }: StatsCardProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                {icon && <div className="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">{icon}</div>}
            </div>

            <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
                {trend && (
                    <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full mb-1 ${trend.positive
                            ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30'
                            : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30'
                        }`}>
                        {trend.positive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                        {trend.value}
                    </span>
                )}
            </div>
        </div>
    );
}
