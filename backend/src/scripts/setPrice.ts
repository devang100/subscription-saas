import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);
    const priceId = args[0];
    const planKey = args[1] || 'PRO'; // Default to PRO if not provided

    if (!priceId) {
        console.error('❌ Please provide the Stripe Price ID as an argument.');
        console.log('   Usage: npx ts-node src/scripts/setPrice.ts <price_id> [plan_key]');
        process.exit(1);
    }

    console.log(`🔄 Updating ${planKey} plan with Price ID: ${priceId}...`);

    try {
        await prisma.plan.update({
            where: { id: planKey }, // Uses 2nd arg or defaults to PRO
            data: { stripePriceId: priceId }
        });
        console.log(`✅ Successfully updated ${planKey}!`);
    } catch (error) {
        console.error('❌ Error updating plan. Did you run the seed script first?');
        console.error(error);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
