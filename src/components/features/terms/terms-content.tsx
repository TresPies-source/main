
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function TermsContent() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-4xl">Terms of Service</CardTitle>
                    <CardDescription>
                        Last updated: July 26, 2024
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-base text-foreground/80 space-y-6 prose dark:prose-invert max-w-none">
                    <p>Please read these terms and conditions carefully before using Our Service.</p>
                    
                    <h2 className="font-headline">Acknowledgment</h2>
                    <p>
                        These are the Terms and Conditions governing the use of this Service and
                        the agreement that operates between You and the Company. These Terms and
                        Conditions set out the rights and obligations of all users regarding the
                        use of the Service.
                    </p>
                    <p>
                        Your access to and use of the Service is conditioned on Your acceptance of
                        and compliance with these Terms and Conditions. These Terms and
                        Conditions apply to all visitors, users and others who access or use the
                        Service.
                    </p>
                    
                    <h2 className="font-headline">Termination</h2>
                    <p>
                        We may terminate or suspend Your access immediately, without prior notice
                        or liability, for any reason whatsoever, including without limitation if
                        You breach these Terms and Conditions.
                    </p>
                    <p>Upon termination, Your right to use the Service will cease immediately.</p>
                    
                    <h2 className="font-headline">"AS IS" and "AS AVAILABLE" Disclaimer</h2>
                    <p>
                        The Service is provided to You "AS IS" and "AS AVAILABLE" and with all
                        faults and defects without warranty of any kind...
                    </p>

                    <h2 className="font-headline">Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, You can contact us:
                        By email: <a href="mailto:help@trespiesdesign.com">help@trespiesdesign.com</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

    