import { Router } from 'express';
import { createCheckoutSession, getSubscription } from '../controllers/subscriptionController';
import { protect } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';

const router = Router();

router.use(protect);

router.post('/:orgId/checkout', requirePermission('billing:write'), createCheckoutSession);
router.get('/:orgId', requirePermission('billing:read'), getSubscription);

export default router;
