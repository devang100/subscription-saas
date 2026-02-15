
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = '21bit072@charusat.edu.in'; // From our previous check
    const password = 'password'; // Assumption, but let's see what happens

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('User found:', user.email);
    console.log('Hash in DB:', user.passwordHash);

    // Let's test a common password if we can, or just log the hash
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
