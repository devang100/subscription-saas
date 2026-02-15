
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const org = await prisma.organization.findFirst();
    console.log(org.id);
}

main().finally(() => prisma.$disconnect());
