import { GraduationCap } from "lucide-react";

export function AppLogoIcon({ className = "h-4 w-4 text-amber-400" }: { className?: string }) {
  return <GraduationCap className={className} aria-hidden="true" />;
}

export function AppLogoBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-7 w-7 rounded-lg",
    md: "h-9 w-9 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
  }[size];

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  }[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-[#0e1726] border border-slate-700 shadow-sm ${sizeClasses}`}
      aria-label="Student Graduation Cap Logo"
    >
      <GraduationCap className={`${iconSizes} text-amber-400`} />
    </div>
  );
}
