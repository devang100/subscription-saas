
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const memberships = await prisma.membership.findMany({
        include: {
            user: { select: { email: true } },
            organization: { select: { name: true } },
            role: { select: { name: true } }
        }
    });
    console.log(JSON.stringify(memberships, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
