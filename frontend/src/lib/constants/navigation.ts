import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  User,
  Megaphone,
  Calendar,
  TrendingUp,
  Bell,
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
  { label: "AI Tutor", href: "/chat", icon: GraduationCap },
  { label: "Revision Notes", href: "/articles", icon: FileText },
  { label: "Notice Board", href: "/notices", icon: Megaphone },
  { label: "Study Calendar", href: "/calendar", icon: Calendar },
  { label: "Performance", href: "/progress", icon: TrendingUp },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

export const NAV_LINKS_DRAWER_LOGGED_IN: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Past Papers", href: "/flashcards", icon: BookOpen },
  { label: "AI Tutor", href: "/chat", icon: GraduationCap },
  { label: "Revision Notes", href: "/articles", icon: FileText },
  { label: "Notice Board", href: "/notices", icon: Megaphone },
  { label: "Study Calendar", href: "/calendar", icon: Calendar },
  { label: "Performance", href: "/progress", icon: TrendingUp },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

export const NAV_LINKS_PUBLIC: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Past Papers", href: "/flashcards", icon: BookOpen },
  { label: "AI Tutor", href: "/chat", icon: GraduationCap },
  { label: "Revision Notes", href: "/articles", icon: FileText },
];
