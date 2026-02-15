import { Router } from 'express';
import { chat, emailDraft, analyzeProject } from '../controllers/aiController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// All AI routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with AI assistant
 * @access  Private
 */
router.post('/chat', chat);

/**
 * @route   POST /api/ai/email
 * @desc    Generate email draft
 * @access  Private
 */
router.post('/email', emailDraft);

/**
 * @route   POST /api/ai/analyze-project
 * @desc    Analyze project health
 * @access  Private
 */
router.post('/analyze-project', analyzeProject);

export default router;
