
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking plans...');
    const plans = await prisma.plan.findMany();
    plans.forEach(p => console.log(`ID: '${p.id}', Name: '${p.name}', Price: '${p.stripePriceId}'`));

    const proPlan = await prisma.plan.findUnique({ where: { id: 'PRO' } });
    console.log('Lookup PRO result:', proPlan);

    if (plans.length === 0 || !plans.some(p => p.id === 'PRO')) {
        console.log('Plans missing or incorrect IDs. Attempting to fix...');

        // Create Pro Plan if missing
        await prisma.plan.upsert({
            where: { id: 'PRO' },
            update: {},
            create: {
                id: 'PRO',
                name: 'Pro',
                stripePriceId: 'price_1QjKIQPZ3q8X6t0g7j8j8j8j', // Placeholder or real ID
                maxUsers: 10
            }
        });

        // Create Enterprise Plan if missing
        await prisma.plan.upsert({
            where: { id: 'ENTERPRISE' },
            update: {},
            create: {
                id: 'ENTERPRISE',
                name: 'Enterprise',
                stripePriceId: 'price_1QjKJnPZ3q8X6t0g7j8j8j8k', // Placeholder or real ID
                maxUsers: 100
            }
        });

        // Create Free Plan if missing
        await prisma.plan.upsert({
            where: { id: 'FREE' },
            update: {},
            create: {
                id: 'FREE',
                name: 'Free',
                stripePriceId: null,
                maxUsers: 2
            }
        });

        console.log('Plans upserted.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
