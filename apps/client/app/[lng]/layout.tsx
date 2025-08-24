import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/db/queries";
import { Toaster } from "@saas/ui";
import { cookies } from "next/headers";
import { languages } from "@/app/i18n/setting";
import { dir } from "i18next";
import { ClientCookiesProvider } from "@/lib/auth/provider";
import { Provider as SessionProvider } from "@/lib/auth/SessionProvider";

export const metadata: Metadata = {
  title: "Next.js SaaS Starter",
  description: "Get started quickly with Next.js, Postgres, and Stripe.",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

const manrope = Manrope({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  let userPromise = getUser();
  const cookieStore = await cookies();
  const theme = cookieStore.get("next-sass-starter-theme")?.value;
  const isDark = theme === "dark";
  const { lng } = await params;

  return (
    <html
      lang={lng}
      dir={dir(lng)}
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${
        manrope.className
      } ${isDark ? "dark" : ""}`}
      style={{ colorScheme: isDark ? "dark" : "light" }}
    >
      <body className="min-h-[100dvh] bg-gray-50 dark:bg-gray-950">
        <UserProvider userPromise={userPromise}>
          <SessionProvider>
            <ClientCookiesProvider>
              {children}
              <Toaster position="bottom-center" />
            </ClientCookiesProvider>
          </SessionProvider>
        </UserProvider>
      </body>
    </html>
  );
}
