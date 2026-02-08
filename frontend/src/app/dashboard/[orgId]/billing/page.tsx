'use client';

import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BillingPage() {
    const { orgId } = useParams();
    const [currentPlan, setCurrentPlan] = useState('Free');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orgId) {
            api.get(`/organizations/${orgId}`)
                .then(res => {
                    const sub = res.data.data.subscription;
                    if (sub && sub.status === 'active') {
                        setCurrentPlan(sub.planId === 'PRO' ? 'Pro' : sub.planId === 'ENTERPRISE' ? 'Enterprise' : 'Free');
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [orgId]);

    const handleUpgrade = async (planName: string) => {
        if (planName === 'Starter') return;
        try {
            const { data } = await api.post(`/subscriptions/${orgId}/checkout`, {
                planId: planName.toUpperCase()
            });
            window.location.href = data.url;
        } catch (e: any) {
            alert(e.response?.data?.message || 'Failed to start checkout.');
        }
    };

    if (loading) return <div className="p-10 text-gray-500 dark:text-gray-400">Loading plan details...</div>;

    return (
        <div className="flex-1 p-10 overflow-auto h-full">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Billing & Plans</h1>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Current Plan: {currentPlan}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {currentPlan === 'Free' ? 'You are on the free tier.' : 'You have an active subscription.'}
                        </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: 'Starter', price: '$0/mo', features: ['2 Users', 'Basic Analytics', 'Community Support'] },
                    { name: 'Pro', price: '$29/mo', features: ['10 Users', 'Advanced Analytics', 'Priority Support'], popular: true },
                    { name: 'Enterprise', price: '$99/mo', features: ['Unlimited Users', 'Custom Reports', 'Dedicated Manager'], popular: false }
                ].map((plan) => (
                    <div key={plan.name} className={`bg-white dark:bg-zinc-900 rounded-xl shadow-sm border ${plan.popular ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-100 dark:border-zinc-800'} p-6 relative transition-all hover:shadow-md`}>
                        {plan.popular && <span className="absolute top-0 right-0 -mt-2 -mr-2 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">POPULAR</span>}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                        <div className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</div>                        <ul className="mt-6 space-y-4">
                            {plan.features.map(f => (
                                <li key={f} className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleUpgrade(plan.name)}
                            disabled={currentPlan === plan.name || (currentPlan === 'Pro' && plan.name === 'Starter')}
                            className={`mt-8 w-full py-2.5 px-4 border border-transparent rounded-lg font-medium transition-all shadow-sm
                                ${currentPlan === plan.name
                                    ? 'bg-green-600 text-white cursor-default'
                                    : plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none' : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700'
                                }`}
                        >
                            {currentPlan === plan.name ? 'Current Plan' : 'Upgrade'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
