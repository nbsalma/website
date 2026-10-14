import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { ProductsSection, WhySection, GlobalSection, ProcessSection } from "@/components/Sections";
import { AboutSection } from "@/components/About";
import { ContactSection } from "@/components/Contact";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <ProductsSection />
      <WhySection />
      <GlobalSection />
      <ProcessSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
