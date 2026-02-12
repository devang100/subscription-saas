import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';

export const createOrg = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        if (!name) return next(new AppError('Organization name is required', 400));

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

        const ownerRole = await prisma.role.findUnique({ where: { name: 'Owner' } });
        if (!ownerRole) return next(new AppError('System Role Owner not found', 500));

        const result = await prisma.$transaction(async (tx: any) => {
            const org = await tx.organization.create({
                data: { name, slug },
            });

            await tx.membership.create({
                data: {
                    userId: req.user.id,
                    organizationId: org.id,
                    roleId: ownerRole.id,
                },
            });
            return org;
        });

        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getOrg = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;
        const org = await prisma.organization.findUnique({
            where: { id: orgId },
            include: { subscription: true }
        });

        if (!org) return next(new AppError('Organization not found', 404));

        res.status(200).json({ success: true, data: org });
    } catch (error) {
        next(error);
    }
};

// ... previous code ...
export const getAllMyOrgs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const memberships = await prisma.membership.findMany({
            where: { userId: req.user.id },
            include: { organization: true, role: true }
        });

        res.status(200).json({ success: true, data: memberships });
    } catch (error) {
        next(error);
    }
};

export const getMembers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    // ...
    try {
        const orgId = req.params.orgId as string;

        const members = await prisma.membership.findMany({
            where: { organizationId: orgId },
            include: { user: { select: { id: true, fullName: true, email: true } }, role: true }
        });

        const invitations = await prisma.invitation.findMany({
            where: { organizationId: orgId, status: 'pending' },
            include: { role: true }
        });

        res.status(200).json({ success: true, data: { members, invitations } });
    } catch (error) {
        // ...
        next(error);
    }
};

// ... imports
import { sendInvitationEmail } from '../services/emailService';
import { logActivity } from '../services/auditService';

export const inviteMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;
        const { email, roleName } = req.body;

        const role = await prisma.role.findUnique({ where: { name: roleName || 'Member' } });
        if (!role) return next(new AppError('Role not found', 400));

        // 1. Enforce Plan Limits
        const orgData = await prisma.organization.findUnique({
            where: { id: orgId },
            include: {
                subscription: { include: { plan: true } },
                _count: { select: { memberships: true } }
            }
        });

        if (!orgData) return next(new AppError('Organization not found', 404));

        const currentCount = orgData._count.memberships;
        const pendingInvites = await prisma.invitation.count({
            where: { organizationId: orgId, status: 'pending' }
        });

        const maxUsers = orgData.subscription?.plan?.maxUsers || 2;

        if (currentCount + pendingInvites >= maxUsers) {
            return next(new AppError(`Plan limit reached (${maxUsers} users). You have ${currentCount} members and ${pendingInvites} pending invites.`, 403));
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Check if already member
            const existing = await prisma.membership.findUnique({
                where: { userId_organizationId: { userId: user.id, organizationId: orgId } }
            });
            if (existing) return next(new AppError('User is already a member', 400));

            // Add directly
            await prisma.membership.create({
                data: {
                    userId: user.id,
                    organizationId: orgId,
                    roleId: role.id
                }
            });

            // Send email saying they were added? Maybe. But focus on Invites.
            await sendInvitationEmail(email, orgData.name, role.name, 'http://localhost:3000/login');

            await logActivity(orgId, req.user.id, 'INVITE_MEMBER', 'User', { email, status: 'Added directly' });

            return res.status(200).json({ success: true, message: 'User added to organization' });
        } else {
            // Check if already invited
            const existingInvite = await prisma.invitation.findFirst({
                where: { email, organizationId: orgId, status: 'pending' }
            });
            if (existingInvite) return next(new AppError('User has a pending invitation', 400));

            // Create Invitation Record
            const token = Math.random().toString(36).substring(7);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            await prisma.invitation.create({
                data: {
                    email,
                    organizationId: orgId,
                    roleId: role.id,
                    token,
                    expiresAt
                }
            });

            await sendInvitationEmail(email, orgData.name, role.name, 'http://localhost:3000/register');

            await logActivity(orgId, req.user.id, 'INVITE_MEMBER', 'Invitation', { email, status: 'Pending' });

            return res.status(200).json({ success: true, message: 'Invitation sent to ' + email });
        }
    } catch (error) {
        next(error);
    }
};

export const resendInvitation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;
        const { invitationId } = req.body;

        const invite = await prisma.invitation.findUnique({
            where: { id: invitationId },
            include: { organization: true, role: true }
        });

        if (!invite || invite.organizationId !== orgId) {
            return next(new AppError('Invitation not found', 404));
        }

        await sendInvitationEmail(invite.email, invite.organization.name, invite.role.name, 'http://localhost:3000/register');

        res.status(200).json({ success: true, message: 'Invitation resented' });
    } catch (error) {
        next(error);
    }
};

export const updateMemberRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;
        const memberId = req.params.memberId as string;
        const { roleName } = req.body;

        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) return next(new AppError('Role not found', 400));

        // Ensure we are not updating the Owner if there is only one? (Enhancement for later)

        await prisma.membership.update({
            where: { id: memberId },
            data: { roleId: role.id }
        });

        res.status(200).json({ success: true, message: 'Member updated' });
    } catch (error) {
        next(error);
    }
};

export const removeMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const memberId = req.params.memberId as string;
        await prisma.membership.delete({ where: { id: memberId } });
        res.status(200).json({ success: true, message: 'Member removed' });
    } catch (error) {
        next(error);
    }
};

export const getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;

        const logs = await prisma.auditLog.findMany({
            where: { organizationId: orgId },
            include: { user: { select: { fullName: true, email: true } } },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        next(error);
    }
};

export const updateOrg = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;
        const { name, slug } = req.body;

        // Check if slug is unique if changing
        if (slug) {
            const existing = await prisma.organization.findUnique({ where: { slug } });
            if (existing && existing.id !== orgId) {
                return next(new AppError('Slug already taken', 400));
            }
        }

        const org = await prisma.organization.update({
            where: { id: orgId },
            data: { name, slug }
        });

        await logActivity(orgId, req.user.id, 'UPDATE_ORG', 'Organization', { name, slug });

        res.status(200).json({ success: true, data: org });
    } catch (error) {
        next(error);
    }
};

export const deleteOrg = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;

        // Double check if user is Owner just in case permission middleware is bypassed or misconfigured?
        // But relying on middleware is standard. 'org:delete' is only for Owners.

        await prisma.organization.delete({
            where: { id: orgId }
        });

        // No audit log possible inside the org since it's gone? 
        // Maybe log to a global system log if it existed, but here we just return success.

        res.status(200).json({ success: true, message: 'Organization deleted' });
    } catch (error) {
        next(error);
    }
};

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orgId = req.params.orgId as string;

        const [projectCount, clientCount, taskStats, recentActivity] = await Promise.all([
            prisma.project.count({
                where: { client: { organizationId: orgId } }
            }),
            prisma.client.count({
                where: { organizationId: orgId, status: 'active' }
            }),
            prisma.task.groupBy({
                by: ['status'],
                where: { project: { client: { organizationId: orgId } } },
                _count: { status: true }
            }),
            prisma.auditLog.findMany({
                where: { organizationId: orgId },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { fullName: true, email: true } } }
            })
        ]);

        // Format task stats into an object
        const taskDistribution = {
            TODO: 0,
            IN_PROGRESS: 0,
            REVIEW: 0,
            DONE: 0
        };

        taskStats.forEach((stat: any) => {
            if (stat.status in taskDistribution) {
                (taskDistribution as any)[stat.status] = stat._count.status;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                projectCount,
                clientCount,
                taskDistribution,
                recentActivity
            }
        });
    } catch (error) {
        next(error);
    }
};
