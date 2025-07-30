import MainLayout from "@/components/layout/main-layout";
import { MotivationJar } from "@/components/features/motivation/motivation-jar";

export default function MotivationPage() {
  return (
    <MainLayout title="Motivation Jar">
      <div className="flex justify-center items-center h-full">
        <MotivationJar />
      </div>
    </MainLayout>
  );
}
