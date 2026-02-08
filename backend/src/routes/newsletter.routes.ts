import { Router } from 'express';

const router = Router();

router.post('/subscribe', (req, res) => {
    // Mock subscription logic
    const { email } = req.body;
    console.log(`New newsletter subscriber: ${email}`);

    // In a real app, you would save this to a DB or send to Mailchimp/ConvertKit

    res.json({ success: true, message: 'Subscribed successfully' });
});

export default router;
