
'use client';

import MainLayout from "@/components/layout/main-layout";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const GratitudeJar = dynamic(
  () => import('@/components/features/gratitude/gratitude-jar').then(mod => mod.GratitudeJar),
  { 
    ssr: false,
    loading: () => (
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Skeleton className="h-[400px] w-full" />
        </div>
        <div className="md:col-span-2">
           <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    ),
  }
);

export default function GratitudePage() {
  return (
    <MainLayout title="Gratitude Jar">
      <GratitudeJar />
    </MainLayout>
  );
}
