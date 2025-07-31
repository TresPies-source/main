import PublicLayout from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <PublicLayout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              This is a placeholder for your Terms of Service. By using Zen Jar,
              users are agreeing to these terms. It's a binding contract that
              outlines the rules and expectations for both you and your users.
            </p>

            <h2>2. User Accounts</h2>
            <p>
              You should specify the requirements for creating an account and
              the user's responsibilities for maintaining their account's
              security.
            </p>

            <h2>3. Prohibited Conduct</h2>
            <p>
              Outline what users are not allowed to do on your platform (e.g.,
              abusing the service, attempting to reverse-engineer the AI,
              violating laws).
            </p>

            <h2>4. Content Ownership and Responsibility</h2>
            <p>
              Clarify who owns the content users create. Typically, users own
              their content, but you are granted a license to use it to provide
              the service.
            </p>
            
            <h2>5. Subscription and Payment (for Pro Tier)</h2>
            <p>
              If you have a Pro tier, you need to detail the subscription terms,
              billing cycles, cancellation policy, and refund policy.
            </p>

            <h2>6. Disclaimers and Limitation of Liability</h2>
            <p>
              Include standard legal disclaimers. For example, the service is
              provided "as is" and you are not liable for certain types of
              damages.
            </p>

            <h2>7. Governing Law</h2>
            <p>
              Specify the jurisdiction whose laws will govern the agreement.
            </p>
            <p>
              <strong>Disclaimer:</strong> This is not legal advice. You should
              consult with a legal professional to draft comprehensive Terms of
              Service that protect both you and your users.
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
