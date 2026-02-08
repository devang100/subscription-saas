import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);
    // Usage: npx ts-node src/scripts/fakeWebhook.ts <org_slug_or_id> <plan_id>

    let orgIdentifier = args[0];
    const planId = args[1] || 'PRO'; // Default to PRO

    // If no org provided, find the first one
    if (!orgIdentifier) {
        const firstOrg = await prisma.organization.findFirst();
        if (!firstOrg) {
            console.error('❌ No organizations found in database.');
            return;
        }
        orgIdentifier = firstOrg.id;
        console.log(`ℹ️  No Org ID provided. using first found: ${firstOrg.name} (${firstOrg.id})`);
    }

    // Resolve Org
    const org = await prisma.organization.findFirst({
        where: {
            OR: [
                { id: orgIdentifier },
                { slug: orgIdentifier }
            ]
        }
    });

    if (!org) {
        console.error(`❌ Organization not found: ${orgIdentifier}`);
        return;
    }

    console.log(`Matched Org: ${org.name}`);

    // Update Subscription
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await prisma.subscription.upsert({
        where: { organizationId: org.id },
        create: {
            organizationId: org.id,
            planId: planId,
            stripeSubId: 'sub_fake_' + Math.floor(Math.random() * 100000),
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: nextMonth,
        },
        update: {
            planId: planId,
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: nextMonth,
        }
    });

    console.log(`✅ SUCCESS! Subscription for "${org.name}" set to "${planId}" (Active).`);
    console.log(`👉 Go refresh your Dashboard to see the changes!`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
