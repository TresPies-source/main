"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function PrivacyContent() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-4xl">Privacy Policy</CardTitle>
                    <CardDescription>
                        Last updated: July 26, 2024
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-base text-foreground/80 space-y-6 prose dark:prose-invert">
                    <p>
                        This Privacy Policy describes Our policies and procedures on the collection,
                        use and disclosure of Your information when You use the Service and tells
                        You about Your privacy rights and how the law protects You.
                    </p>
                    
                    <h2 className="font-headline">Interpretation and Definitions</h2>
                    <h3 className="font-headline">Interpretation</h3>
                    <p>
                        The words of which the initial letter is capitalized have meanings defined
                        under the following conditions. The following definitions shall have the
                        same meaning regardless of whether they appear in singular or in plural.
                    </p>
                    
                    <h2 className="font-headline">Collecting and Using Your Personal Data</h2>
                    <h3 className="font-headline">Types of Data Collected</h3>
                    <h4>Personal Data</h4>
                    <p>
                        While using Our Service, We may ask You to provide Us with certain
                        personally identifiable information that can be used to contact or
                        identify You. Personally identifiable information may include, but is not
                        limited to: Email address, First name and last name, Usage Data.
                    </p>
                    <h4>Usage Data</h4>
                    <p>
                        Usage Data is collected automatically when using the Service. Usage Data
                        may include information such as Your Device's Internet Protocol address
                        (e.g. IP address), browser type, browser version, the pages of our
                        Service that You visit, the time and date of Your visit, the time spent
                        on those pages, unique device identifiers and other diagnostic data.
                    </p>

                    <h2 className="font-headline">Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, You can contact us:
                        By email: [Your Contact Email Here]
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
