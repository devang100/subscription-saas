export default function TermsPage() {
    return (
        <div className="py-20 container mx-auto px-6 max-w-3xl prose dark:prose-invert">
            <h1>Terms of Service</h1>
            <p className="text-gray-500 text-lg mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <p>By accessing or using Stratis, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our services.</p>

            <h3>1. Usage License</h3>
            <p>We grant you a limited, non-exclusive, non-transferable license to use Stratis for your internal business purposes, subject to these Terms.</p>

            <h3>2. User Responsibilities</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree not to misuse our services or help anyone else do so.</p>

            <h3>3. Intellectual Property</h3>
            <p>The Stratis platform and its original content, features, and functionality are owned by Stratis and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>

            <h3>4. Termination</h3>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

            <h3>5. Limitation of Liability</h3>
            <p>In no event shall Stratis, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
        </div>
    );
}
