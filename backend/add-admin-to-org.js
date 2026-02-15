
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@gmail.com';
    const orgId = '54fb0432-d046-48a4-b8a1-8cda81028668';

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.error('User not found');
        return;
    }

    // Get Owner role
    const ownerRole = await prisma.role.findUnique({ where: { name: 'Owner' } });
    if (!ownerRole) {
        console.error('Role not found');
        return;
    }

    await prisma.membership.upsert({
        where: {
            userId_organizationId: {
                userId: user.id,
                organizationId: orgId
            }
        },
        update: {
            roleId: ownerRole.id
        },
        create: {
            userId: user.id,
            organizationId: orgId,
            roleId: ownerRole.id
        }
    });

    console.log(`Added/Updated ${email} in org ${orgId}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
