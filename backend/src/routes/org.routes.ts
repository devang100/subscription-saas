import { Router } from 'express';
import { createOrg, getOrg, getAllMyOrgs, getMembers, inviteMember, updateMemberRole, removeMember, getAuditLogs, resendInvitation, updateOrg, deleteOrg, getDashboardStats } from '../controllers/orgController';
import { protect } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';

const router = Router();

router.use(protect);

router.get('/me', getAllMyOrgs); // List all orgs I belong to
router.post('/', createOrg);

// Org specific routes
router.get('/:orgId', requirePermission('org:read'), getOrg);
router.patch('/:orgId', requirePermission('org:write'), updateOrg);
router.delete('/:orgId', requirePermission('org:delete'), deleteOrg);
router.get('/:orgId/stats', requirePermission('org:read'), getDashboardStats);

router.get('/:orgId/members', requirePermission('org:read'), getMembers);
router.post('/:orgId/invites', requirePermission('org:read'), inviteMember);
router.post('/:orgId/invites/resend', requirePermission('org:read'), resendInvitation);
router.patch('/:orgId/members/:memberId', requirePermission('org:read'), updateMemberRole);
router.delete('/:orgId/members/:memberId', requirePermission('org:read'), removeMember);
router.get('/:orgId/audit-logs', requirePermission('org:read'), getAuditLogs);

export default router;
