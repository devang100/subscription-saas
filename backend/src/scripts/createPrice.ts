import 'dotenv/config';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any
});

async function main() {
    const args = process.argv.slice(2);
    const productId = args[0]; // e.g. prod_TnXtqZVz0U9k9V
    const amountInCents = parseInt(args[1] || '9900'); // Default $99.00
    const planKey = args[2] || 'ENTERPRISE';

    if (!productId) {
        console.error('❌ Please provide the Stripe Product ID.');
        console.log('   Usage: npx ts-node src/scripts/createPrice.ts <prod_id> <amount_cents> <plan_key>');
        process.exit(1);
    }

    console.log(`Creating Price for Product ${productId} ($${amountInCents / 100})...`);

    try {
        const price = await stripe.prices.create({
            product: productId,
            unit_amount: amountInCents,
            currency: 'usd',
            recurring: { interval: 'month' },
        });

        console.log(`✅ Created Price ID: ${price.id}`);

        console.log(`🔄 Updating DB Plan ${planKey}...`);
        await prisma.plan.update({
            where: { id: planKey },
            data: { stripePriceId: price.id }
        });

        console.log(`✅ Database updated! You can now Subscribe to ${planKey}.`);

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
