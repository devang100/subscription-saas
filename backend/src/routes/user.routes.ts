import { Router } from 'express';
import { getMe, updateMe } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/me', getMe);
router.patch('/me', updateMe);

export default router;
