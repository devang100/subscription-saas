import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: LucideIcon;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-gray-300">/</span>}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                        >
                            {item.icon && <item.icon size={14} />}
                            {item.label}
                        </Link>
                    ) : (
                        <span className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-white">
                            {item.icon && <item.icon size={14} />}
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
