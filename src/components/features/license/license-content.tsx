
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function LicenseContent() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-4xl">ZenJar Application Software License</CardTitle>
                    <CardDescription>
                        Last Updated: July 30, 2025
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-base text-foreground/80 space-y-6 prose dark:prose-invert max-w-none">
                    <p>
                        This Software License Agreement ("License") is a legal agreement between you ("Licensee" or "You") and ZenJar ("Licensor," "we," "us," or "our") for the use of the ZenJar application software, including its web application, browser extensions, chat bot integrations (Slack, Discord), and any associated documentation, updates, and AI models ("Software").
                    </p>
                    <p>
                        By installing, accessing, or using the Software, you agree to be bound by the terms of this License. If you do not agree to the terms of this License, do not install, access, or use the Software.
                    </p>

                    <h2 className="font-headline">1. Grant of License</h2>
                    <p>
                        Subject to the terms and conditions of this License, ZenJar grants You a limited, non-exclusive, non-transferable, non-sublicensable, and revocable license to:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Access and use the Software solely for your personal, non-commercial purposes.</li>
                        <li>Install and use the browser extension component of the Software on compatible web browsers.</li>
                        <li>Access and use the chat bot integrations of the Software on compatible platforms (e.g., Slack, Discord).</li>
                    </ul>
                    <p>This License is for your personal use only and does not grant you any rights to obtain future upgrades, updates, or enhancements.</p>

                    <h2 className="font-headline">2. Restrictions</h2>
                    <p>You agree not to, and will not permit others to:</p>
                    <ul className="list-disc pl-6">
                        <li>Copy, modify, adapt, translate, reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code or underlying algorithms of the Software, or any part thereof.</li>
                        <li>Rent, lease, lend, sell, redistribute, sublicense, or otherwise transfer the Software or any rights granted hereunder.</li>
                        <li>Use the Software for any commercial purpose without the express written consent of ZenJar.</li>
                        <li>Remove, alter, or obscure any copyright, trademark, or other proprietary notices from the Software.</li>
                        <li>Use the Software in any manner that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, or otherwise objectionable.</li>
                        <li>Use the Software to develop any competing software or service.</li>
                        <li>Bypass or attempt to bypass any technological measures within the Software designed to protect intellectual property rights or enforce usage limitations (e.g., free tier limits).</li>
                        <li>Use the AI models or any components of the Software for purposes other than those explicitly permitted by the functionality of the ZenJar application.</li>
                    </ul>

                    <h2 className="font-headline">3. Ownership</h2>
                    <p>
                        The Software is licensed, not sold. ZenJar retains all right, title, and interest in and to the Software, including all copyrights, trademarks, trade secrets, patents, and any other intellectual property rights. This License does not grant you any ownership rights in the Software.
                    </p>

                    <h2 className="font-headline">4. No Warranty</h2>
                    <p>
                        THE SOFTWARE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. ZENJAR DOES NOT WARRANT THAT THE SOFTWARE WILL MEET YOUR REQUIREMENTS, OPERATE WITHOUT INTERRUPTION, BE ERROR-FREE, OR BE COMPATIBLE WITH ANY PARTICULAR HARDWARE OR SOFTWARE.
                    </p>

                    <h2 className="font-headline">5. Limitation of Liability</h2>
                    <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ZENJAR BE LIABLE FOR ANY INCIDENTAL, SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OR INABILITY TO USE THE SOFTWARE, HOWEVER CAUSED, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, OR OTHERWISE) AND EVEN IF ZENJAR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                    </p>
                    <p>
                        SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF LIABILITY FOR PERSONAL INJURY, OR OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITATION MAY NOT APPLY TO YOU.
                    </p>

                    <h2 className="font-headline">6. Termination</h2>
                    <p>
                        This License is effective until terminated. Your rights under this License will terminate automatically and without notice from ZenJar if you fail to comply with any term(s) of this License. Upon termination of this License, you must cease all use of the Software and destroy all copies, full or partial, of the Software. ZenJar reserves the right to terminate your access to the Software at its sole discretion, with or without cause.
                    </p>

                    <h2 className="font-headline">7. Governing Law</h2>
                    <p>
                        This License shall be governed by and construed in accordance with the laws of [Your Jurisdiction, e.g., the State of California], without regard to its conflict of law principles.
                    </p>

                    <h2 className="font-headline">8. Entire Agreement</h2>
                    <p>
                        This License constitutes the entire agreement between you and ZenJar regarding the use of the Software and supersedes all prior or contemporaneous understandings and agreements, whether written or oral, regarding such subject matter.
                    </p>

                    <h2 className="font-headline">9. Contact Information</h2>
                    <p>If you have any questions about this License, please contact us at:</p>
                    <p>
                        <a href="mailto:help@trespiesdesign.com">help@trespiesdesign.com</a><br/>
                        <a href="https://zenjarapp.com" target="_blank" rel="noopener noreferrer">zenjarapp.com</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
