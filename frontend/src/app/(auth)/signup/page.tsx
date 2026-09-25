import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthForm } from "@/components/shared/auth-form";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user.loggedIn) {
    redirect("/dashboard");
  }
  return <AuthForm mode="signup" />;
}
