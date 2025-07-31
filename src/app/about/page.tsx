import MainLayout from "@/components/layout/main-layout";
import { AboutContent } from "@/components/features/about/about-content";

export default function AboutPage() {
  return (
    <MainLayout title="About ZenJar">
      <AboutContent />
    </MainLayout>
  );
}
