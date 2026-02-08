import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';

export const getMyNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        // Count unread
        const unreadCount = await prisma.notification.count({
            where: { userId: req.user.id, isRead: false }
        });

        res.status(200).json({ success: true, data: { notifications, unreadCount } });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        await prisma.notification.update({
            where: { id, userId: req.user.id }, // Ensure user owns it
            data: { isRead: true }
        });

        res.status(200).json({ success: true, message: 'Marked as read' });
    } catch (error) {
        next(error);
    }
};

export const markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: { isRead: true }
        });

        res.status(200).json({ success: true, message: 'All marked as read' });
    } catch (error) {
        next(error);
    }
};
