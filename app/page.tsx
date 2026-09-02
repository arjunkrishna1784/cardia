import { AboutSection } from "@/components/site/about-section";
import { ComputationalVisualization } from "@/components/site/computational-visualization";
import { ContactSection } from "@/components/site/contact-section";
import { CredibilityStrip } from "@/components/site/credibility-strip";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";
import { PipelineSection } from "@/components/site/pipeline-section";
import { ResearchSection } from "@/components/site/research-section";
import { TeamSection } from "@/components/site/team-section";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-white px-4 py-2 text-sm font-medium text-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Hero />
        <CredibilityStrip />
        <ResearchSection />
        <PipelineSection />
        <ComputationalVisualization />
        <AboutSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
