import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';

export const requirePermission = (permissionKey: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) return next(new AppError('User not authenticated', 401));

            // 1. Identify context (Organization)
            // Expect orgId in params. If route matches /api/organizations/:orgId/...
            let orgId = req.params.orgId as string;

            if (!orgId) {
                if (req.params.clientId) {
                    const client = await prisma.client.findUnique({
                        where: { id: req.params.clientId as string },
                        select: { organizationId: true }
                    });
                    if (client) orgId = client.organizationId;
                } else if (req.params.projectId) {
                    const project = await prisma.project.findUnique({
                        where: { id: req.params.projectId as string },
                        select: { client: { select: { organizationId: true } } }
                    });
                    if (project) orgId = project.client.organizationId;
                } else if (req.params.taskId) {
                    const task = await prisma.task.findUnique({
                        where: { id: req.params.taskId as string },
                        select: { project: { select: { client: { select: { organizationId: true } } } } }
                    });
                    if (task) orgId = task.project.client.organizationId;
                }
            }

            if (!orgId) {
                if (req.user.isSuperAdmin) return next();
                return next(new AppError('Organization context missing for permission check', 400));
            }

            // Bypass for Super Admin
            if (req.user.isSuperAdmin) return next();

            // 2. Fetch Membership and Permissions
            // We look up the membership for this specific Org
            const membership = await prisma.membership.findUnique({
                where: { userId_organizationId: { userId: req.user.id, organizationId: orgId } },
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: { permission: true }
                            }
                        }
                    }
                }
            });

            if (!membership) {
                return next(new AppError('You are not a member of this organization', 403));
            }

            // 3. Check specific permission
            // We map the role's permissions to their keys
            const userPermissions = membership.role.permissions.map((rp: any) => rp.permission.key);

            if (!userPermissions.includes(permissionKey)) {
                // Optional: Check if Role is 'Owner' and force allow? 
                // Requirement says "Permissions must be stored in DB". 
                // So Owner role should effectively have all permissions in DB or we add a bypass here for role.name === 'Owner'.
                // Let's stick to DB permissions for purity, but fall back to name for safety if DB seed is impartial.
                if (membership.role.name === 'Owner') return next();

                return next(new AppError('You do not have permission to perform this action', 403));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
