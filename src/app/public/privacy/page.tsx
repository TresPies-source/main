import PublicLayout from '@/components/layout/public-layout';

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="container max-w-4xl py-12">
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <h1>Privacy Policy for ZenJar</h1>

          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

          <p>
            Welcome to ZenJar. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect via the Application includes:
          </p>
          <ul>
            <li>
              <strong>Personal Data:</strong> Personally identifiable information, such as your name, and email address, that you voluntarily give to us when you register with the Application. You are under no obligation to provide us with personal information of any kind; however, your refusal to do so may prevent you from using certain features of the Application.
            </li>
            <li>
              <strong>User-Generated Data:</strong> We collect the data you generate within the app, such as tasks, gratitude entries, intentions, and wins. This data is stored securely and is only accessible to you.
            </li>
            <li>
              <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Application.
            </li>
          </ul>

          <h2>Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
          </p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Provide the core functionality of the ZenJar application.</li>
            <li>Anonymously improve our AI models and application performance.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
          </ul>

          <h2>Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
          
          <h2>Policy for Children</h2>
          <p>
            We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: support@zenjar.app
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
