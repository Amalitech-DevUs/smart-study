"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { PanelLeftOpen } from "lucide-react";
import { SideNav } from "@/components/shared/side-nav";
import { MobileTopBar } from "@/components/shared/mobile-top-bar";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer } from "@/components/shared/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ToastContainer } from "@/components/shared/toast-container";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Restore user's sidebar preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("smartstudy_sidebar_open");
      if (saved !== null) {
        setIsSidebarOpen(saved === "true");
      }
    } catch {
      // localStorage not accessible
    }
  }, []);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    try {
      localStorage.setItem("smartstudy_sidebar_open", "false");
    } catch {}
  };

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
    try {
      localStorage.setItem("smartstudy_sidebar_open", "true");
    } catch {}
  };

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
      {showSidebar && (
        <SideNav isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      )}

      {/* Floating button to reopen sidebar on desktop when closed */}
      {showSidebar && !isSidebarOpen && (
        <button
          type="button"
          onClick={handleOpenSidebar}
          className="hidden md:flex fixed top-4 left-4 z-40 h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-md transition-all hover:bg-slate-50 hover:text-slate-950 hover:scale-105 active:scale-95"
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      {/* Mobile top bar for inner app pages */}
      {showSidebar && <MobileTopBar />}

      {/* Page content — offset by sidebar width only when sidebar is active and open */}
      <div
        className={`flex flex-1 flex-col transition-[padding] duration-300 ease-in-out ${
          showSidebar && isSidebarOpen ? "md:pl-[240px]" : "md:pl-0"
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
