
'use client';

import MainLayout from "@/components/layout/main-layout";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const MotivationJar = dynamic(
  () => import('@/components/features/motivation/motivation-jar').then(mod => mod.MotivationJar),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full max-w-4xl mx-auto" />
  }
);

export default function MotivationPage() {
  return (
    <MainLayout title="Motivation Jar">
      <div className="flex justify-center items-center h-full">
        <MotivationJar />
      </div>
    </MainLayout>
  );
}
