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

        const plan = await prisma.plan.findUnique({ where: { id: planId } });
        console.log('Plan lookup result:', plan);

        if (!plan) return next(new AppError('Invalid Plan ID', 400));

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
    // Get current sub details
    res.status(200).json({ success: true, data: {} });
};
