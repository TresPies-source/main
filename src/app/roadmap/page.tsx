import MainLayout from "@/components/layout/main-layout";
import { RoadmapContent } from "@/components/features/roadmap/roadmap-content";

export default function RoadmapPage() {
  return (
    <MainLayout title="Development Roadmap">
      <RoadmapContent />
    </MainLayout>
  );
}
