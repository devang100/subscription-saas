import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';
import { logActivity } from '../services/auditService';
import { createNotification } from '../services/notificationService';
import { getIO } from '../services/socketService';

// ============ CLIENTS ============

export const createClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;
        const { name, email, phone } = req.body;

        if (!name) return next(new AppError('Client name is required', 400));

        const client = await prisma.client.create({
            data: {
                name,
                email,
                phone,
                organizationId: orgId
            }
        });

        await logActivity(orgId, req.user.id, 'CREATE_CLIENT', 'Client', { clientName: name });

        res.status(201).json({ success: true, data: client });
    } catch (error) {
        next(error);
    }
};

export const getClients = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;

        const clients = await prisma.client.findMany({
            where: { organizationId: orgId },
            include: {
                _count: { select: { projects: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: clients });
    } catch (error) {
        next(error);
    }
};

export const updateClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const clientId = req.params.clientId as string;
        const { name, email, phone, status } = req.body;

        const client = await prisma.client.update({
            where: { id: clientId },
            data: { name, email, phone, status }
        });

        res.status(200).json({ success: true, data: client });
    } catch (error) {
        next(error);
    }
};

// ============ PROJECTS ============

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const clientId = req.params.clientId as string;
        const { name, description } = req.body;

        if (!name) return next(new AppError('Project name is required', 400));

        const project = await prisma.project.create({
            data: {
                name,
                description,
                clientId
            }
        });

        res.status(201).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const clientId = req.params.clientId as string;

        const projects = await prisma.project.findMany({
            where: { clientId },
            include: {
                _count: { select: { tasks: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        next(error);
    }
};

// ============ TASKS ============

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.projectId as string;
        const { title, description, priority, assigneeId, dueDate } = req.body;

        if (!title) return next(new AppError('Task title is required', 400));

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                projectId,
                dueDate: dueDate ? new Date(dueDate) : null,
                assigneeId: assigneeId || null
            },
            include: {
                assignee: { select: { id: true, fullName: true, email: true } },
                project: {
                    select: {
                        name: true,
                        client: { select: { organizationId: true } }
                    }
                },
                attachments: true
            }
        });

        if (task.assigneeId && task.assigneeId !== req.user.id) {
            await createNotification(
                task.assigneeId,
                'New Task Assigned',
                `You have been assigned to task "${task.title}" in project "${task.project.name}"`,
                'INFO',
                `/dashboard/${task.project.client.organizationId}/projects/${projectId}`
            );
        }

        try {
            getIO().to(`project:${projectId}`).emit('task_created', task);
        } catch (e) {
            console.warn('Socket emit failed');
        }

        res.status(201).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.projectId as string;

        const tasks = await prisma.task.findMany({
            where: { projectId },
            include: {
                assignee: { select: { id: true, fullName: true, email: true } },
                attachments: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.taskId as string;
        const { title, description, status, priority, assigneeId, dueDate } = req.body;

        // Prepare update data
        const updateData: any = { title, description, status, priority };

        if (dueDate !== undefined) {
            updateData.dueDate = dueDate ? new Date(dueDate) : null;
        }

        if (assigneeId !== undefined) {
            updateData.assigneeId = assigneeId || null;
        }

        const task = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
            include: {
                assignee: { select: { id: true, fullName: true, email: true } }
            }
        });

        try {
            // Find project ID to emit to correct room
            // We can fetch it or just emit if we knew it. But we only have taskId.
            // Better to fetch project ID if not in hand, or just emit to all relevant?
            // Let's refetch task with project ID to be safe or optimize later.
            // For now, let's just assume frontend might be listening to a 'project:{projectId}' room.
            // But we don't have projectId easily here without reading it.
            // Let's rely on the first read.
            const fullTask = await prisma.task.findUnique({
                where: { id: taskId },
                select: { projectId: true }
            });
            if (fullTask) {
                getIO().to(`project:${fullTask.projectId}`).emit('task_updated', task);
            }
        } catch (e) {
            console.warn('Socket emit update failed');
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.taskId as string;

        const task = await prisma.task.findUnique({
            where: { id: taskId },
            select: { projectId: true, id: true }
        });

        if (!task) return next(new AppError('Task not found', 404));

        await prisma.task.delete({ where: { id: taskId } });

        try {
            getIO().to(`project:${task.projectId}`).emit('task_deleted', { taskId });
        } catch (e) {
            console.warn('Socket emit delete failed');
        }

        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
};

export const getMyTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;
        const userId = req.user.id;

        const tasks = await prisma.task.findMany({
            where: {
                assigneeId: userId,
                project: {
                    client: {
                        organizationId: orgId
                    }
                }
            },
            include: {
                project: {
                    select: { name: true, id: true, client: { select: { name: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};
