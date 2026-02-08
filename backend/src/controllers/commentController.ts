import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';

export const addComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.taskId as string;
        const { content } = req.body;

        if (!content) return next(new AppError('Content is required', 400));

        const comment = await prisma.comment.create({
            data: {
                content,
                taskId,
                userId: req.user.id
            },
            include: { user: { select: { fullName: true, id: true, email: true } } }
        });

        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        next(error);
    }
};

export const getComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.taskId as string;

        const comments = await prisma.comment.findMany({
            where: { taskId },
            include: { user: { select: { fullName: true, id: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        next(error);
    }
};

export const logTime = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.taskId as string;
        const { minutes, description } = req.body;

        if (!minutes) return next(new AppError('Minutes are required', 400));

        const log = await prisma.timeLog.create({
            data: {
                minutes: Number(minutes),
                description,
                taskId,
                userId: req.user.id
            },
            include: { user: { select: { fullName: true } } }
        });

        res.status(201).json({ success: true, data: log });
    } catch (error) {
        next(error);
    }
};

export const getTimeLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.taskId as string;

        const logs = await prisma.timeLog.findMany({
            where: { taskId },
            include: { user: { select: { fullName: true } } },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        next(error);
    }
};
