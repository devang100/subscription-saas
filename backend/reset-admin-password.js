
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@gmail.com';
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
        where: { email },
        data: { passwordHash }
    });

    console.log(`Password for ${email} reset to ${password}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
