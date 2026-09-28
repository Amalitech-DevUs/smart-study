import {
  LayoutDashboard,
  BookOpen,
  Bot,
  FileText,
  User,
  Megaphone,
  Calendar,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_LINKS_LOGGED_IN: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Past Papers", href: "/flashcards", icon: BookOpen },
  { label: "AI Tutor", href: "/chat", icon: Bot },
  { label: "Revision Notes", href: "/articles", icon: FileText },
  { label: "Notice Board", href: "/dashboard#notices", icon: Megaphone },
  { label: "Study Calendar", href: "/dashboard#calendar", icon: Calendar },
  { label: "Performance", href: "/dashboard#performance", icon: TrendingUp },
];

export const NAV_LINKS_DRAWER_LOGGED_IN: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Past Papers", href: "/flashcards", icon: BookOpen },
  { label: "AI Tutor", href: "/chat", icon: Bot },
  { label: "Revision Notes", href: "/articles", icon: FileText },
  { label: "Notice Board", href: "/dashboard#notices", icon: Megaphone },
  { label: "Study Calendar", href: "/dashboard#calendar", icon: Calendar },
];

export const NAV_LINKS_PUBLIC: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Past Papers", href: "/flashcards", icon: BookOpen },
  { label: "AI Tutor", href: "/chat", icon: Bot },
  { label: "Revision Notes", href: "/articles", icon: FileText },
];
