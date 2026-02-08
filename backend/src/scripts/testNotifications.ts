
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
    console.log('Testing Prisma Connection...');
    const userCount = await prisma.user.count();
    console.log('Users:', userCount);

    console.log('Testing Notification Model...');
    // Create a dummy notification if users exist
    const user = await prisma.user.findFirst();
    if (user) {
        const notif = await prisma.notification.create({
            data: {
                userId: user.id,
                title: 'Test Notification',
                type: 'INFO'
            }
        });
        console.log('Notification created:', notif.id);

        await prisma.notification.delete({ where: { id: notif.id } });
        console.log('Notification deleted');
    } else {
        console.log('No users found to test notifications');
    }
}

test()
    .catch((e) => {
        console.error('Test Failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
