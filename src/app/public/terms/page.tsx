import PublicLayout from "@/components/layout/public-layout";

export default function TermsPage() {
    // Placeholder content, user will provide the real content.
  return (
    <PublicLayout>
      <article className="prose dark:prose-invert max-w-4xl mx-auto">
        <h1>Terms of Service</h1>
        <p className="lead">Please read these Terms of Service carefully. This is a placeholder for your real terms.</p>
        <p>Last updated: October 26, 2023</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By using ZenJar, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>

        <h2>2. Description of Service</h2>
        <p>ZenJar is a wellness and productivity application. You understand that the service is provided "as-is" and that we assume no responsibility for the timeliness, deletion, or failure to store any user data or personalization settings.</p>

        <h2>3. User Accounts</h2>
        <p>You are responsible for safeguarding your account. You agree not to disclose your password to any third party.</p>
        
        <h2>4. User Conduct</h2>
        <p>You agree not to use the service for any unlawful purpose or to violate any laws in your jurisdiction.</p>

        <h2>5. Pro Tier and Subscriptions</h2>
        <p>This section would detail the terms of any paid subscriptions, including billing, cancellation, and refund policies.</p>

        <h2>6. Termination</h2>
        <p>We may terminate or suspend your account at our sole discretion, without prior notice, for conduct that violates these Terms.</p>
        
        <h2>7. Disclaimer of Warranties</h2>
        <p>The service is provided on an "as is" and "as available" basis. We make no warranty that the service will meet your requirements or be uninterrupted or error-free.</p>

        <h2>8. Limitation of Liability</h2>
        <p>In no event shall ZenJar be liable for any indirect, incidental, or consequential damages.</p>
      </article>
    </PublicLayout>
  );
}
