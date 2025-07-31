
'use client';

import MainLayout from "@/components/layout/main-layout";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const WinJar = dynamic(
  () => import('@/components/features/wins/win-jar').then(mod => mod.WinJar),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full max-w-4xl mx-auto" />
  }
);

export default function WinsPage() {
  return (
    <MainLayout title="Win Jar">
      <WinJar />
    </MainLayout>
  );
}
