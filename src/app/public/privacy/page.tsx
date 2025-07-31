import PublicLayout from "@/components/layout/public-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
    // Placeholder content, user will provide the real content.
  return (
    <PublicLayout>
       <article className="prose dark:prose-invert max-w-4xl mx-auto">
            <h1>Privacy Policy</h1>
            <p className="lead">Your privacy is important to us. This is a placeholder for your real privacy policy.</p>
            <p>Last updated: October 26, 2023</p>

            <h2>1. Information We Collect</h2>
            <p>This section will detail the types of information you collect from users, such as account information (email, name), user-generated content (tasks, gratitude entries), and usage data.</p>
            
            <h2>2. How We Use Your Information</h2>
            <p>Explain how you use the collected data. For example, to provide the service, personalize the experience, communicate with users, and improve the application.</p>
            
            <h2>3. Data Sharing and Disclosure</h2>
            <p>Describe the circumstances under which user data might be shared with third parties. For ZenJar, this would primarily be with Firebase and Google for authentication and API integrations, which should be clearly stated.</p>

            <h2>4. Data Storage and Security</h2>
            <p>Detail how and where you store data (e.g., on Firebase Firestore) and the security measures in place to protect it.</p>
            
            <h2>5. Your Data Rights</h2>
            <p>Inform users of their rights, such as the right to access, correct, or delete their data. Mention the "Delete Account" feature here.</p>
            
            <h2>6. Changes to This Policy</h2>
            <p>Explain that you may update the privacy policy and how you will notify users of changes.</p>
            
            <h2>7. Contact Us</h2>
            <p>Provide a way for users to contact you with questions about the privacy policy.</p>
        </article>
    </PublicLayout>
  );
}
