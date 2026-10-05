import { JsonLd } from "@/components/seo/JsonLd";
import { About } from "@/components/sections/About";
import { Areas } from "@/components/sections/Areas";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { StatsBand } from "@/components/sections/StatsBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { Transformations } from "@/components/sections/Transformations";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { WhyUs } from "@/components/sections/WhyUs";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(site.faqs)} />
      <Hero />
      <StatsBand />
      <TrustMarquee />
      <About />
      <Services />
      <Projects />
      <Transformations />
      <Process />
      <WhyUs />
      <Testimonials />
      <Areas />
      <Faq />
      <Contact />
    </>
  );
}
