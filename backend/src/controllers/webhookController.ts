import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any
});

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (err: any) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionCompleted(session);
                break;
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdated(subscription);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Webhook handler failed', error);
        res.status(500).send('Webhook handler failed');
        return;
    }

    res.status(200).send();
};

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    if (!session.metadata?.orgId || !session.metadata?.planId) {
        console.warn('Missing metadata in session', session.id);
        return;
    }

    const { orgId, planId } = session.metadata;
    const stripeSubId = session.subscription as string;

    // Fetch full subscription details to get dates
    const stripeSub: any = await stripe.subscriptions.retrieve(stripeSubId);

    await prisma.subscription.upsert({
        where: { organizationId: orgId },
        create: {
            organizationId: orgId,
            planId: planId,
            stripeSubId: stripeSubId,
            status: stripeSub.status,
            currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
        },
        update: {
            planId: planId, // Plan might have changed
            stripeSubId: stripeSubId,
            status: stripeSub.status,
            currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
        }
    });

    // Update Plan maxUsers capability if needed? 
    // The Schema links Plan to Subscription, so fetching Subscription.plan gives access to limits.
    console.log(`✅ Subscription active for Org: ${orgId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const sub: any = subscription; // Cast to any to avoid type errors
    const existingSub = await prisma.subscription.findUnique({
        where: { stripeSubId: sub.id }
    });

    if (!existingSub) return;

    await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
            status: sub.status,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
        }
    });
    console.log(`🔄 Subscription updated: ${sub.id} (${sub.status})`);
}
