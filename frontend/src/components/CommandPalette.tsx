"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Search,
    LayoutDashboard,
    CheckSquare,
    Users,
    CreditCard,
    Settings,
    Moon,
    Sun,
    Plus,
    Briefcase
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const { setTheme } = useTheme();
    const { user } = useAuthStore();

    // Org Id context
    const orgId = params?.orgId as string;

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-in fade-in duration-200">
            <Command className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center border-b border-gray-100 dark:border-zinc-800 px-4">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <Command.Input
                        placeholder="Type a command or search..."
                        className="flex-1 h-14 outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder:text-gray-400 text-sm"
                    />
                    <div className="text-xs text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">ESC</div>
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                    <Command.Empty className="py-6 text-center text-sm text-gray-500">No results found.</Command.Empty>

                    {orgId && (
                        <Command.Group heading="Navigation" className="text-xs text-gray-400 font-medium mb-2 px-2">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push(`/dashboard/${orgId}`))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors aria-selected:bg-indigo-50 aria-selected:text-indigo-600"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Overview</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push(`/dashboard/${orgId}/my-tasks`))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors aria-selected:bg-indigo-50 aria-selected:text-indigo-600"
                            >
                                <CheckSquare className="w-4 h-4" />
                                <span>My Tasks</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push(`/dashboard/${orgId}/clients`))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors aria-selected:bg-indigo-50 aria-selected:text-indigo-600"
                            >
                                <Briefcase className="w-4 h-4" />
                                <span>Clients</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push(`/dashboard/${orgId}/users`))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors aria-selected:bg-indigo-50 aria-selected:text-indigo-600"
                            >
                                <Users className="w-4 h-4" />
                                <span>Team</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push(`/dashboard/${orgId}/billing`))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors aria-selected:bg-indigo-50 aria-selected:text-indigo-600"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>Billing</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push(`/dashboard/${orgId}/settings`))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors aria-selected:bg-indigo-50 aria-selected:text-indigo-600"
                            >
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </Command.Item>
                        </Command.Group>
                    )}

                    <Command.Group heading="Actions" className="text-xs text-gray-400 font-medium mb-2 px-2 mt-2">
                        <Command.Item
                            onSelect={() => runCommand(() => setTheme("light"))}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors aria-selected:bg-indigo-50 aria-selected:text-indigo-600"
                        >
                            <Sun className="w-4 h-4" />
                            <span>Light Mode</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => setTheme("dark"))}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors aria-selected:bg-indigo-50 aria-selected:text-indigo-600"
                        >
                            <Moon className="w-4 h-4" />
                            <span>Dark Mode</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </Command>
        </div>
    );
}
