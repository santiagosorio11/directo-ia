import { OnboardingProvider } from "../context/OnboardingContext";
import { OnboardingFlow } from "../components/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <OnboardingProvider>
        <OnboardingFlow />
      </OnboardingProvider>
    </main>
  );
}
