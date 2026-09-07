import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import { BottomNav } from "@/components/shared/bottom-nav";
import { ChatWidget } from "@/components/chat/chat-widget";
import { Footer } from "@/components/shared/footer";
import { MobileTopBar } from "@/components/shared/mobile-top-bar";
import { TopNav } from "@/components/shared/top-nav";
import "./globals.css";

const headingFont = Baloo_2({
  variable: "--font-heading-family",
  weight: ["500", "700"],
  subsets: ["latin"],
});

const bodyFont = Inter({
  variable: "--font-body-family",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Study — Master Past Exam Questions & Revision",
  description:
    "Interactive exam practice, flashcards, AI study assistant, and bite-sized learning tailored for student success.",
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
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background font-body text-text-primary"
      >
        <TopNav />
        <MobileTopBar />
        <div className="flex-1">{children}</div>
        <Footer />
        <ChatWidget />
        <BottomNav />
      </body>
    </html>
  );
}
