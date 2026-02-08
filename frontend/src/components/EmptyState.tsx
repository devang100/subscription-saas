import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900/50 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400 mb-6">
                <Icon size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">{description}</p>

            {action && (
                action.href ? (
                    <Link
                        href={action.href}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                    >
                        {action.label}
                    </Link>
                ) : (
                    <button
                        onClick={action.onClick}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                    >
                        {action.label}
                    </button>
                )
            )}
        </div>
    );
}
