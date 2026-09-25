import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { HomeHero } from "@/components/shared/home-hero";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CurriculumSection } from "@/components/landing/CurriculumSection";
import { AiTutorShowcase } from "@/components/landing/AiTutorShowcase";
import { LandingCta } from "@/components/landing/LandingCta";

export default async function Home() {
  const user = await getCurrentUser();
  if (user.loggedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-white min-h-screen">
      <HomeHero />
      <FeaturesSection />
      <CurriculumSection />
      <AiTutorShowcase />
      <LandingCta />
    </div>
  );
}