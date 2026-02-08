import { Router } from 'express';
import { sendEmail } from '../services/emailService';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // In a real app, send this to admin email
        await sendEmail('admin@stratis.com', `New Contact Form Submission from ${name}`, `
            <h3>Contact Form</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `);

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

export default router;
