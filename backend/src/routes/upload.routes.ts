import { Router } from 'express';
import { upload, uploadFile, deleteFile } from '../controllers/uploadController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/', upload.single('file'), uploadFile);
router.delete('/:id', deleteFile);

export default router;
