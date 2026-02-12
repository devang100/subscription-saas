'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for freelancers just starting out.",
        features: ["2 Users", "3 Projects", "Basic Support", "500MB Storage"],
        cta: "Start for Free",
        href: "/register",
        popular: false
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "For growing teams and agencies.",
        features: ["10 Users", "Unlimited Projects", "Priority Support", "10GB Storage", "Client Portal"],
        cta: "Get Started",
        href: "/register?plan=PRO",
        popular: true
    },
    {
        name: "Enterprise",
        price: "$99",
        period: "/month",
        description: "For large organizations with specific needs.",
        features: ["Unlimited Users", "Unlimited Projects", "Dedicated Manager", "1TB Storage", "SSO & Audit Logs"],
        cta: "Contact Sales",
        href: "/contact",
        popular: false
    }
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Simple, transparent pricing.
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`relative bg-white dark:bg-zinc-900 rounded-2xl p-8 border ${plan.popular ? 'border-indigo-600 ring-2 ring-indigo-600 shadow-2xl scale-105 z-10' : 'border-gray-200 dark:border-zinc-800 shadow-lg'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                                    <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 h-10">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                                {plan.period && <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 flex items-center justify-center shrink-0">
                                            <Check size={12} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`block w-full py-3 rounded-xl text-center font-bold transition-all ${plan.popular
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30'
                                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
