import { Router } from 'express';
import { getPortalData, generatePortalToken } from '../controllers/portalController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Public
router.get('/:token', getPortalData);

// Protected
router.post('/generate/:clientId', protect, generatePortalToken);

export default router;
