import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
    status: 'active' | 'inactive' | 'pending' | 'warning' | 'error';
    className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
    const colors = {
        active: "bg-green-500",
        inactive: "bg-gray-300",
        pending: "bg-yellow-500",
        warning: "bg-orange-500",
        error: "bg-red-500",
    };

    return (
        <span className={cn("relative flex h-3 w-3", className)}>
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", colors[status])}></span>
            <span className={cn("relative inline-flex rounded-full h-3 w-3", colors[status])}></span>
        </span>
    );
}
