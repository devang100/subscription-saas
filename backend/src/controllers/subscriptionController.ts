import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any // Force cast or use 'latest' if supported, to avoid TS strictness on version strings
});

export const createCheckoutSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;
        const { planId } = req.body;
        console.log('Received planId:', planId);

        if (!planId) return next(new AppError('Plan ID is required', 400));

        let plan = await prisma.plan.findUnique({ where: { id: planId } });
        console.log('Plan lookup result:', plan);

        // Fallback: Try case-insensitive lookup if direct ID failed
        if (!plan) {
            console.log('Direct plan lookup failed. Trying case-insensitive search...');
            const fallbackPlan = await prisma.plan.findFirst({
                where: {
                    OR: [
                        { id: { equals: planId, mode: 'insensitive' } },
                        { name: { equals: planId, mode: 'insensitive' } }
                    ]
                }
            });
            if (fallbackPlan) plan = fallbackPlan;
        }

        if (!plan) return next(new AppError(`Invalid Plan ID: ${planId}`, 400));

        if (!plan.stripePriceId) {
            return next(new AppError('This plan cannot be purchased directly (Free plan?)', 400));
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: plan.stripePriceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL}/dashboard/${orgId}?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/dashboard/${orgId}/billing?canceled=true`,
            metadata: {
                orgId: orgId,
                planId: plan.id
            }
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        // Handle Stripe errors gracefully
        console.error('Stripe Error:', error);
        next(new AppError('Failed to create checkout session', 500));
    }
};

export const getSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;

        const subscription = await prisma.subscription.findUnique({
            where: { organizationId: orgId },
            include: { plan: true }
        });

        if (!subscription) {
            // It's possible an org has no subscription record if they are on a legacy free tier that wasn't created as a subscription object,
            // or if the subscription creation failed.
            // We can return null or a default "Free" state.
            return res.status(200).json({ success: true, data: null });
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(new AppError('Failed to fetch subscription details', 500));
    }
};

// Emergency Seed Endpoint for Production
export const seedPlans = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const plans = [
            { id: 'PRO', name: 'Pro', stripePriceId: 'price_1SqaBGLEDmCRYrGAKZnWaEd6', maxUsers: 10 },
            { id: 'ENTERPRISE', name: 'Enterprise', stripePriceId: 'price_1SqaBHLEDmCRYrGAkiyz4GIW', maxUsers: 100 },
            { id: 'FREE', name: 'Free', stripePriceId: null, maxUsers: 2 }
        ];

        const results: any[] = [];
        for (const p of plans) {
            const result = await prisma.plan.upsert({
                where: { id: p.id },
                update: { stripePriceId: p.stripePriceId },
                create: p
            });
            results.push(result);
        }
        res.json({ success: true, message: 'Plans seeded successfully', data: results });
    } catch (error) {
        next(error);
    }
};
