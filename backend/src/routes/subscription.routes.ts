import { Router } from 'express';
import { createCheckoutSession, getSubscription, seedPlans } from '../controllers/subscriptionController';
import { protect } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';

const router = Router();

router.use(protect);

router.post('/:orgId/checkout', requirePermission('billing:write'), createCheckoutSession);
router.get('/:orgId', requirePermission('billing:read'), getSubscription);
router.post('/seed', requirePermission('billing:write'), seedPlans as any); // Temporary restricted endpoint

export default router;
