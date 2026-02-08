import 'dotenv/config';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any
});

async function main() {
    console.log('🚀 Starting Stripe Setup...');

    // 1. Create Product
    console.log('📦 Creating Product "Agency OS"...');
    const product = await stripe.products.create({
        name: 'Agency OS Subscription',
        description: 'Access to Agency OS Platform',
    });
    console.log(`✅ Product Created: ${product.id}`);

    // 2. Create Plans
    const plans = [
        { key: 'PRO', name: 'Pro Plan', amount: 2900 },
        { key: 'ENTERPRISE', name: 'Enterprise Plan', amount: 9900 }
    ];

    for (const p of plans) {
        console.log(`💲 Creating Price for ${p.name} ($${p.amount / 100})...`);
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: p.amount,
            currency: 'usd',
            recurring: { interval: 'month' },
        });

        console.log(`   -> Price ID: ${price.id}`);

        // 3. Update DB
        console.log(`   -> Updating DB Plan ${p.key}...`);

        // Upsert Plan just in case
        await prisma.plan.upsert({
            where: { id: p.key },
            update: { stripePriceId: price.id },
            create: {
                id: p.key,
                name: p.name,
                stripePriceId: price.id,
                maxUsers: p.key === 'PRO' ? 10 : 9999,
                features: {}, // Default empty
                usageLimits: {}
            }
        });

        console.log(`   ✅ DB Updated for ${p.key}`);
    }

    // Ensure Free Plan exists
    await prisma.plan.upsert({
        where: { id: 'FREE' },
        update: {},
        create: {
            id: 'FREE',
            name: 'Free Plan',
            maxUsers: 1
        }
    });
    console.log('✅ Verified Free Plan');

    console.log('🎉 Stripe Setup Complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
