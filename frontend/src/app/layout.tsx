import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { MotionProvider } from "@/components/shared/motion-provider";
import { NotificationProvider } from "@/lib/notification-context";
import { AuthProvider } from "@/lib/use-auth";
import { AppShell } from "@/components/shared/app-shell";
import { PwaRegister } from "@/components/pwa/pwa-register";
import "./globals.css";

const headingFont = Plus_Jakarta_Sans({
  variable: "--font-heading-family",
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

const bodyFont = Inter({
  variable: "--font-body-family",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0e1726",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Smart Study: Past Exam Practice and Revision",
  description:
    "Interactive exam practice, flashcards, AI study assistant, and structured learning for student success.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SmartStudy",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background font-body text-text-primary"
      >
        <MotionProvider>
          <AuthProvider>
            <NotificationProvider>
              <PwaRegister />
              <AppShell>{children}</AppShell>
            </NotificationProvider>
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
