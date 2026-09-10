import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { BottomNav } from "@/components/shared/bottom-nav";
import { ChatWidget } from "@/components/chat/chat-widget";
import { Footer } from "@/components/shared/footer";
import { MobileTopBar } from "@/components/shared/mobile-top-bar";
import { MotionProvider } from "@/components/shared/motion-provider";
import { TopNav } from "@/components/shared/top-nav";
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

export const metadata: Metadata = {
  title: "Smart Study: Past Exam Practice and Revision",
  description:
    "Interactive exam practice, flashcards, AI study assistant, and structured learning for student success.",
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
          <TopNav />
          <MobileTopBar />
          <div className="flex-1">{children}</div>
          <Footer />
          <ChatWidget />
          <BottomNav />
        </MotionProvider>
      </body>
    </html>
  );
}
