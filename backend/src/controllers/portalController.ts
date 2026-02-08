import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';
import crypto from 'crypto';

export const getPortalData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token as string;
        if (!token) return next(new AppError('Token is required', 400));

        const client = await prisma.client.findUnique({
            where: { portalToken: token },
            include: {
                projects: {
                    include: {
                        tasks: {
                            orderBy: { createdAt: 'desc' }
                        }
                    }
                }
            }
        });

        if (!client) return next(new AppError('Invalid portal token', 404));

        res.status(200).json({ success: true, data: client });
    } catch (error) {
        next(error);
    }
};

export const generatePortalToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientId = req.params.clientId as string;
        if (!clientId) return next(new AppError('Client ID is required', 400));

        // Check permissions (e.g. org:write) -> done in route

        const token = crypto.randomBytes(32).toString('hex');

        const client = await prisma.client.update({
            where: { id: clientId },
            data: { portalToken: token }
        });

        res.status(200).json({ success: true, data: { token } });
    } catch (error) {
        next(error);
    }
};
