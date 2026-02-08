
import { prisma } from '../server';
import { getIO } from './socketService';

export const createNotification = async (
    userId: string,
    title: string,
    message: string,
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO',
    link?: string
) => {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link
            }
        });

        // Emit socket event
        try {
            const io = getIO();
            io.to(`user:${userId}`).emit('notification_new', notification);
        } catch (e) {
            console.warn('Socket emit failed', e);
        }

    } catch (error) {
        console.error('Failed to create notification', error);
    }
};
