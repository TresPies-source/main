
'use client';

import MainLayout from "@/components/layout/main-layout";
import { GratitudeJar } from "@/components/features/gratitude/gratitude-jar";

export default function GratitudePage() {
  return (
    <MainLayout title="Gratitude Jar">
      <GratitudeJar />
    </MainLayout>
  );
}
