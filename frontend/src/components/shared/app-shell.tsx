"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SideNav } from "@/components/shared/side-nav";
import { MobileTopBar } from "@/components/shared/mobile-top-bar";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer } from "@/components/shared/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ToastContainer } from "@/components/shared/toast-container";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isLanding = pathname === "/";
  const isAuth =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/register";
  const isExamRunner =
    pathname.startsWith("/flashcards/") &&
    pathname.split("/").filter(Boolean).length >= 3;

  const showSidebar = !isLanding && !isAuth && !isExamRunner;

  return (
    <>
      {/* Top Header exclusively for the Landing / Home screen */}
      {isLanding && <LandingHeader />}

      {/* Left sidebar for authenticated app pages on desktop */}
      {showSidebar && <SideNav />}

      {/* Mobile top bar for inner app pages */}
      {showSidebar && <MobileTopBar />}

      {/* Page content — offset by sidebar width only when sidebar is active */}
      <div
        className={`flex flex-1 flex-col ${
          showSidebar ? "md:pl-[240px]" : ""
        }`}
      >
        <div className="flex-1">{children}</div>
        <Footer />
      </div>

      <ChatWidget />
      <ToastContainer />
    </>
  );
}
