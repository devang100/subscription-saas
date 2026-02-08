import nodemailer from 'nodemailer';

// Create a transporter
// For dev, we use Ethereal which catches emails.
// In prod, use SendGrid/AWS SES.

let transporter: nodemailer.Transporter;

const initEmail = async () => {
    if (transporter) return;

    if (process.env.NODE_ENV === 'production') {
        // Configure production email here
        console.warn('Email service not configured for production yet.');
        return;
    }

    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    console.log('📧 Email Service Initialized (Ethereal)');
};

export const sendEmail = async (to: string, subject: string, html: string) => {
    await initEmail();

    if (!transporter) return;

    const info = await transporter.sendMail({
        from: '"Stratis" <system@stratis.com>',
        to,
        subject,
        html,
    });

    console.log('📨 Email sent: %s', info.messageId);
    console.log('🔗 Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

export const sendInvitationEmail = async (email: string, orgName: string, role: string, inviteLink: string) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>You've been invited!</h2>
            <p>You have been invited to join <strong>${orgName}</strong> as a <strong>${role}</strong>.</p>
            <p>Click the button below to accept the invitation and set up your account.</p>
            <a href="${inviteLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Join Team</a>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't expect this, you can safely ignore this email.</p>
        </div>
    `;
    await sendEmail(email, `Invitation to join ${orgName}`, html);
};
