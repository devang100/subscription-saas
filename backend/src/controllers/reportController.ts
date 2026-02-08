
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';

export const getTimeReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(1)); // Default 1st of month
        const end = endDate ? new Date(endDate as string) : new Date();

        // 1. Fetch raw logs
        const logs = await prisma.timeLog.findMany({
            where: {
                task: {
                    project: {
                        client: {
                            organizationId: orgId
                        }
                    }
                },
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                user: { select: { id: true, fullName: true, email: true } },
                task: {
                    select: {
                        id: true,
                        title: true,
                        project: { select: { id: true, name: true, client: { select: { name: true } } } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Aggregate by User
        const userStats: any = {};
        logs.forEach(log => {
            const userId = log.userId;
            if (!userStats[userId]) {
                userStats[userId] = {
                    user: log.user,
                    totalMinutes: 0,
                    tasks: 0
                };
            }
            userStats[userId].totalMinutes += log.minutes;
            userStats[userId].tasks += 1;
        });

        const aggregatedUsers = Object.values(userStats);

        res.status(200).json({
            success: true,
            data: {
                logs,
                aggregatedUsers,
                period: { start, end }
            }
        });

    } catch (error) {
        next(error);
    }
};
