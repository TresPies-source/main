import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AuthProvider } from '@/components/auth/auth-provider';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { cn } from '@/lib/utils';
import { Inter, Lora } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});


export const metadata: Metadata = {
  title: 'Zen Jar',
  description: 'An AI-powered sanctuary for focus, gratitude, and motivation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased font-sans", inter.variable, lora.variable)}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="kyoto-garden-light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
