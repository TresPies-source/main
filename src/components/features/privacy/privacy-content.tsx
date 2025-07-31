
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function PrivacyContent() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-4xl">ZenJar App Privacy Policy</CardTitle>
                    <CardDescription>
                        Last Updated: July 30, 2025
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-base text-foreground/80 space-y-6 prose dark:prose-invert max-w-none">
                    <p>
                        This Privacy Policy describes how ZenJar ("we," "us," or "our") collects, uses, and discloses your information in connection with your use of our ZenJar application (the "App"), including its web, browser extension, and chat bot integrations (Slack, Discord), and any related services.
                    </p>
                    <p>
                        By accessing or using the App, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not use the App.
                    </p>

                    <h2 className="font-headline">1. Information We Collect</h2>
                    <p>We collect information to provide and improve the ZenJar App and its features. The types of information we collect include:</p>

                    <h3 className="font-headline">1.1. Information You Provide Directly</h3>
                    <ul className="list-disc pl-6">
                        <li><strong>Account Information:</strong> When you create an account or sign in, we collect information associated with your Google Account, such as your email address and name. If you use anonymous authentication, we generate a temporary user ID.</li>
                        <li><strong>User-Generated Content:</strong>
                            <ul className="list-disc pl-6 mt-2">
                                <li><strong>Task Jar:</strong> Tasks you input (brain dumps, categorized tasks, priorities).</li>
                                <li><strong>Motivation Jar:</strong> Any custom affirmations you add (Pro feature).</li>
                                <li><strong>Gratitude Jar:</strong> Gratitude entries and associated ratings.</li>
                                <li><strong>Intention Setter:</strong> Your daily intentions.</li>
                                <li><strong>Win Jar:</strong> Descriptions of your accomplishments.</li>
                            </ul>
                        </li>
                        <li><strong>Communication Data:</strong> Any information you provide when you contact us for support or inquiries.</li>
                    </ul>

                    <h3 className="font-headline">1.2. Information Collected Automatically</h3>
                     <ul className="list-disc pl-6">
                        <li><strong>Usage Data:</strong> Information about how you access and use the App, such as the features you use, the time and duration of your activities, and interactions with AI features (e.g., number of tasks processed, intentions set).</li>
                        <li><strong>Technical Data:</strong> Device information (e.g., browser type, operating system), IP address, and unique device identifiers.</li>
                        <li><strong>Authentication Tokens:</strong> Secure tokens used to maintain your session and authenticate with Firebase.</li>
                    </ul>

                    <h3 className="font-headline">1.3. Information from Third-Party Integrations</h3>
                    <p>When you connect ZenJar with third-party services (e.g., Google Calendar, Google Tasks, Google Keep, Google Docs, Google Drive, Slack, Discord), you authorize us to access and process certain information from those services as permitted by your settings on those services and their respective privacy policies. This may include:</p>
                    <ul className="list-disc pl-6">
                        <li><strong>Google Calendar:</strong> Event details (when you choose to create events from tasks).</li>
                        <li><strong>Google Tasks:</strong> Task list content (for synchronization).</li>
                        <li><strong>Google Keep/Docs:</strong> Text content (for importing into the Task Jar).</li>
                        <li><strong>Google Drive:</strong> File metadata and content (for exporting your data).</li>
                        <li><strong>Slack/Discord:</strong> User IDs, channel IDs, and command inputs for bot interactions.</li>
                    </ul>

                    <h2 className="font-headline">2. How We Use Your Information</h2>
                    <p>We use the information we collect for the following purposes:</p>
                    <ul className="list-disc pl-6">
                        <li><strong>To Provide and Maintain the App:</strong> To operate, deliver, and maintain the functionality of the Task Jar, Motivation Jar, Gratitude Jar, Intention Setter, Focus Timer, and Win Jar.</li>
                        <li><strong>Authentication and Account Management:</strong> To allow you to sign in, manage your account, and link anonymous data to your permanent account.</li>
                        <li><strong>AI-Powered Features:</strong> To process your input (e.g., brain dumps, intentions) using AI models (e.g., Gemini via Genkit) for categorization, prioritization, supportive responses, and insights.</li>
                        <li><strong>Personalization:</strong> To tailor your experience within the App, such as providing personalized motivational quotes or intention responses (Pro feature).</li>
                        <li><strong>Data Persistence and Synchronization:</strong> To save your user-generated content and synchronize it across your devices and connected third-party services.</li>
                        <li><strong>Improve and Develop the App:</strong> To understand usage patterns, analyze feature effectiveness, and develop new features and improvements.</li>
                        <li><strong>Customer Support:</strong> To respond to your inquiries, provide technical support, and address any issues you may encounter.</li>
                        <li><strong>Security and Fraud Prevention:</strong> To protect the App and our users from unauthorized access, fraud, and other security threats.</li>
                        <li><strong>Compliance with Legal Obligations:</strong> To comply with applicable laws, regulations, and legal processes.</li>
                        <li><strong>Monetization (Pro Features):</strong> To manage your ZenJar Pro subscription, process payments, and deliver premium features.</li>
                    </ul>

                    <h2 className="font-headline">3. How We Share Your Information</h2>
                    <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                    <ul className="list-disc pl-6">
                        <li><strong>With Your Consent:</strong> We may share your information when you give us explicit permission to do so, such as when you connect a third-party service.</li>
                        <li><strong>Service Providers:</strong> We engage trusted third-party service providers to perform functions on our behalf, such as hosting (Firebase Hosting), database management (Firestore), authentication (Firebase Authentication), cloud functions (Firebase Cloud Functions), AI model processing (Google's AI models via Genkit), and payment processing (Stripe/RevenueCat). These providers only have access to the information necessary to perform their services and are obligated to protect your information.</li>
                        <li><strong>Third-Party Integrations:</strong> When you enable integrations with services like Google Calendar, Google Tasks, Slack, or Discord, we share information with those services as necessary to provide the requested functionality. Your data handling by these third parties is governed by their respective privacy policies.</li>
                        <li><strong>Legal Requirements and Law Enforcement:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency request).</li>
                        <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you via email or a prominent notice on our App of any such change in ownership or control of your personal information.</li>
                        <li><strong>Aggregated or De-identified Data:</strong> We may share aggregated or de-identified information that cannot reasonably be used to identify you.</li>
                    </ul>

                    <h2 className="font-headline">4. Data Storage and Security</h2>
                     <ul className="list-disc pl-6">
                        <li><strong>Storage Location:</strong> Your data is stored in Google Cloud's Firestore database, which adheres to Google's robust security standards.</li>
                        <li><strong>Security Measures:</strong> We implement technical and organizational measures designed to protect your information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption in transit and at rest, access controls, and regular security reviews.</li>
                        <li><strong>User Responsibility:</strong> While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.</li>
                    </ul>

                    <h2 className="font-headline">5. Data Retention</h2>
                    <p>We retain your personal information for as long as necessary to provide the App's services, comply with our legal obligations, resolve disputes, and enforce our agreements. If you delete your account, we will delete your personal information, though some residual information may remain in our backup systems for a limited period as required by law or for legitimate business purposes.</p>

                    <h2 className="font-headline">6. Your Privacy Rights</h2>
                    <p>Depending on your location and applicable laws (such as GDPR or CCPA), you may have certain rights regarding your personal information:</p>
                     <ul className="list-disc pl-6">
                        <li><strong>Access:</strong> You have the right to request access to the personal information we hold about you.</li>
                        <li><strong>Correction/Rectification:</strong> You have the right to request that we correct any inaccurate or incomplete personal information.</li>
                        <li><strong>Deletion/Erasure:</strong> You have the right to request the deletion of your personal information. You can delete your account directly within the App's settings.</li>
                        <li><strong>Data Portability:</strong> You have the right to request a copy of your personal information in a structured, commonly used, and machine-readable format.</li>
                        <li><strong>Objection to Processing:</strong> You have the right to object to the processing of your personal information in certain circumstances.</li>
                        <li><strong>Withdraw Consent:</strong> Where we rely on your consent to process your personal information, you have the right to withdraw that consent at any time.</li>
                    </ul>
                    <p>To exercise any of these rights, please contact us using the contact information provided below. We will respond to your request in accordance with applicable law.</p>

                    <h2 className="font-headline">7. Children's Privacy</h2>
                    <p>The ZenJar App is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without verifiable parental consent, we will take steps to delete that information.</p>

                    <h2 className="font-headline">8. Changes to This Privacy Policy</h2>
                    <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.</p>

                    <h2 className="font-headline">9. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
                    <p>
                        <a href="mailto:help@trespiesdesign.com">help@trespiesdesign.com</a><br/>
                        <a href="https://zenjarapp.com" target="_blank" rel="noopener noreferrer">zenjarapp.com</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

    