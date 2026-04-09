import { OnboardingProvider } from "../context/OnboardingContext";
import { OnboardingFlow } from "../components/OnboardingFlow";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data?.user;
  const userEmail = data?.user?.email || "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <OnboardingProvider initialStep={0} initialEmail={userEmail}>
        <OnboardingFlow />
      </OnboardingProvider>
    </main>
  );
}
