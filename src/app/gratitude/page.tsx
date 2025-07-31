
'use client';

import MainLayout from "@/components/layout/main-layout";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const GratitudeJar = dynamic(() => import('@/components/features/gratitude/gratitude-jar').then(mod => mod.GratitudeJar), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[800px]" />
});

export default function GratitudePage() {
  return (
    <MainLayout title="Gratitude Jar">
      <GratitudeJar />
    </MainLayout>
  );
}
