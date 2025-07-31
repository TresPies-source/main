import PublicLayout from '@/components/layout/public-layout';

export default function TermsOfServicePage() {
  return (
    <PublicLayout>
      <div className="container max-w-4xl py-12">
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <h1>Terms of Service for ZenJar</h1>

          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By using our application, ZenJar, you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the Application.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            ZenJar is a wellness and productivity tool designed to help users organize tasks, practice gratitude, and find motivation. The Application uses AI to provide some of its features.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You are responsible for safeguarding your account and for any activities or actions under your account. We are not liable for any loss or damage arising from your failure to comply with this security obligation.
          </p>
          
          <h2>4. User Content</h2>
          <p>
            You are solely responsible for the content you create and store in ZenJar (e.g., tasks, gratitude entries). You retain all rights to your content. We will not access, view, or use your content except as necessary to maintain or provide the Application's services or as required by law.
          </p>

          <h2>5. Prohibited Activities</h2>
          <p>
            You agree not to use the Application for any unlawful purpose or to engage in any activity that is harmful, fraudulent, deceptive, or offensive.
          </p>
          
          <h2>6. Termination</h2>
          <p>
            We may terminate or suspend your access to the Application at any time, without prior notice or liability, for any reason, including if you breach these Terms.
          </p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The Application is provided "as is," without any warranties of any kind. We do not warrant that the Application will be uninterrupted, secure, or error-free.
          </p>
          
          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall ZenJar be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Application.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will provide notice of changes by posting the new terms on this page. Your continued use of the Application after any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: support@zenjar.app
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
