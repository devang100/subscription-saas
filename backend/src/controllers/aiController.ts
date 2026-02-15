import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { chatWithAI, generateClientEmail, analyzeProjectHealth } from '../services/aiService';
import { AppError } from '../utils/AppError';

/**
 * POST /api/ai/chat
 * General AI chat endpoint
 */
export const chat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { message, orgId, projectId, taskId, conversationHistory } = req.body;

        if (!message || !orgId) {
            return next(new AppError('Message and orgId are required', 400));
        }

        const response = await chatWithAI(
            message,
            {
                orgId,
                userId: req.user.id,
                projectId,
                taskId
            },
            conversationHistory || []
        );

        res.status(200).json({
            success: true,
            data: { response }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/ai/email
 * Generate email draft
 */
export const emailDraft = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { orgId, projectId, emailType, additionalContext } = req.body;

        if (!orgId || !emailType) {
            return next(new AppError('orgId and emailType are required', 400));
        }

        const validTypes = ['update', 'invoice', 'onboarding', 'custom'];
        if (!validTypes.includes(emailType)) {
            return next(new AppError('Invalid email type', 400));
        }

        const emailContent = await generateClientEmail(
            {
                orgId,
                userId: req.user.id,
                projectId
            },
            emailType,
            additionalContext
        );

        res.status(200).json({
            success: true,
            data: { emailContent }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/ai/analyze-project
 * Analyze project health
 */
export const analyzeProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { orgId, projectId } = req.body;

        if (!orgId || !projectId) {
            return next(new AppError('orgId and projectId are required', 400));
        }

        const analysis = await analyzeProjectHealth({
            orgId,
            userId: req.user.id,
            projectId
        });

        res.status(200).json({
            success: true,
            data: { analysis }
        });
    } catch (error) {
        next(error);
    }
};
