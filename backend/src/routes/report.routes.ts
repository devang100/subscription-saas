import { Router } from 'express';
import { getTimeReports } from '../controllers/reportController';
import { protect } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';

const router = Router();
router.use(protect);

router.get('/organizations/:orgId/time', requirePermission('org:read'), getTimeReports);

export default router;
