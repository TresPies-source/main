import PublicLayout from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Zen Jar. This is a placeholder for your Privacy Policy.
              It's important to be transparent with your users about what data you
              collect, why you collect it, and how you use it.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              You should detail the types of information you collect here. For
              Zen Jar, this might include:
            </p>
            <ul>
              <li>
                <strong>Account Information:</strong> Name, email address, and
                profile picture from Google Sign-In.
              </li>
              <li>
                <strong>User-Generated Content:</strong> Tasks, gratitude
                entries, intentions, wins, and focus session data.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how users interact
                with the application.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              Explain the purpose of data collection. For example, to provide
              the core service, to personalize the experience, and to power AI
              features.
            </p>

            <h2>4. Data Sharing and Third Parties</h2>
            <p>
              Disclose if and how you share data with third parties (e.g.,
              Google for authentication and AI processing, payment processors).
            </p>

            <h2>5. Your Rights and Choices</h2>
            <p>
              Inform users about their rights regarding their data, such as
              accessing, correcting, or deleting their information.
            </p>

            <h2>6. Contact Us</h2>
            <p>
              Provide a way for users to contact you with any privacy-related
              questions.
            </p>
            <p>
              <strong>Disclaimer:</strong> This is not legal advice. You should
              consult with a legal professional to draft a comprehensive
              privacy policy that complies with all applicable laws and
              regulations.
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
