'use client';

import { motion } from 'framer-motion';
import { Kanban, MessageSquare, CreditCard, Users, Zap, Folder, BarChart, Shield } from 'lucide-react';

const features = [
    {
        title: "Project Management",
        description: "Visualize your workflow with our intuitive Kanban board. Drag, drop, and done.",
        icon: Kanban,
        color: "bg-blue-500",
        colSpan: "col-span-1 md:col-span-2",
        delay: 0
    },
    {
        title: "Real-time Collaboration",
        description: "Chat with your team and get instant updates on tasks and files.",
        icon: MessageSquare,
        color: "bg-green-500",
        colSpan: "col-span-1",
        delay: 0.1
    },
    {
        title: "Automated Billing",
        description: "Handle subscriptions and invoices automatically via Stripe.",
        icon: CreditCard,
        color: "bg-indigo-500",
        colSpan: "col-span-1",
        delay: 0.2
    },
    {
        title: "Client Portal",
        description: "Give your clients a dedicated space to view progress and approve work.",
        icon: Users,
        color: "bg-violet-500",
        colSpan: "col-span-1 md:col-span-2",
        delay: 0.3
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-gray-50 dark:bg-zinc-900/50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Everything you need to run your agency.
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Packed with powerful features to help you manage your team, clients, and projects in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: feature.delay }}
                            className={`${feature.colSpan} bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-xl transition-shadow group`}
                        >
                            <div className={`w-12 h-12 rounded-lg ${feature.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-6 h-6 ${feature.color.replace('bg-', 'text-')}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Secondary Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
                    {[
                        { icon: Zap, label: "Fast Performance" },
                        { icon: Folder, label: "File Sharing" },
                        { icon: BarChart, label: "Analytics" },
                        { icon: Shield, label: "Secure by Default" }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                                <item.icon size={20} />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-200">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
