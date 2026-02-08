export default function PrivacyPage() {
    return (
        <div className="py-20 container mx-auto px-6 max-w-3xl prose dark:prose-invert">
            <h1>Privacy Policy</h1>
            <p className="text-gray-500 text-lg mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <p>At Stratis, we take your privacy seriously. This policy describes how we collect, use, and protect your data when you use our platform.</p>

            <h3>1. Data Collection</h3>
            <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, company information, and payment details.</p>

            <h3>2. How We Use Your Data</h3>
            <p>We use the collected information to:</p>
            <ul>
                <li>Provide, maintain, and improve our services.</li>
                <li>Process transactions and send related information.</li>
                <li>Send you technical notices, updates, and support messages.</li>
                <li>Respond to your comments and questions.</li>
            </ul>

            <h3>3. Data Security</h3>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

            <h3>4. Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal data. You may also object to processing or request data portability.</p>

            <h3>5. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@stratis.com">privacy@stratis.com</a>.</p>
        </div>
    );
}
