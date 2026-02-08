import { Router } from 'express';
import { handleStripeWebhook } from '../controllers/webhookController';
import express from 'express';

const router = Router();

// Webhooks often need raw body for signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
