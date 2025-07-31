
'use client';

import MainLayout from "@/components/layout/main-layout";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MotivationJar = dynamic(() => import('@/components/features/motivation/motivation-jar').then(mod => mod.MotivationJar), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[700px]" />
});


export default function MotivationPage() {
  return (
    <MainLayout title="Motivation Jar">
      <MotivationJar />
    </MainLayout>
  );
}
