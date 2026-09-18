import { CategoryCards } from "./category-cards";
import EventPlannerHero from "./event-planner-hero";
import { HeroBanner } from "./hero-banner";
import { HowItWorks } from "./how-it-works";

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-home text-ink">
      <main>
        <HeroBanner />
        <CategoryCards />
        <EventPlannerHero />
        <HowItWorks />
 
 
      </main>
    </div>
  );
}
