import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import { Toaster } from "@/components/ui/sonner"
import { cookies } from 'next/headers';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Next.js SaaS Starter',
  description: 'Get started quickly with Next.js, Postgres, and Stripe.',
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();
  const cookieStore = await cookies();
  const theme = cookieStore.get('next-sass-starter-theme')?.value;
  const isDark = theme === 'dark';
  
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className} ${isDark ? 'dark' : ''}`}
      style={{ colorScheme: isDark ? 'dark' : 'light' }}
    >
      <body className="min-h-[100dvh] bg-gray-50 dark:bg-gray-950">
        <UserProvider userPromise={userPromise}>
          {children}
          <Toaster position='bottom-center'/>
        </UserProvider>
      </body>
    </html>
  );
}
