import { AboutHeader } from "./about/AboutHeader";
import { ProjectOverviewSection } from "./about/ProjectOverviewSection";
import { PartnersSection } from "./about/PartnersSection";
import { AudienceSection } from "./about/AudienceSection";
import { audienceItems, projectHighlights } from "./about/aboutData";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      <AboutHeader />

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <ProjectOverviewSection projectHighlights={projectHighlights} />
        <PartnersSection />
        <AudienceSection items={audienceItems} />
      </main>
    </div>
  );
}
