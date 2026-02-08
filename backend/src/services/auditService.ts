import { prisma } from '../server';

export const logActivity = async (
    orgId: string,
    userId: string,
    action: string,
    entity: string,
    details?: any
) => {
    try {
        await prisma.auditLog.create({
            data: {
                organizationId: orgId,
                userId: userId,
                action,
                entity,
                details: details ? JSON.stringify(details) : undefined,
            }
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw error to avoid blocking the main action
    }
};
