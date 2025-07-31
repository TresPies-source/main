
'use client';

import MainLayout from "@/components/layout/main-layout";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const IntentionSetter = dynamic(
  () => import('@/components/features/intention/intention-setter').then(mod => mod.IntentionSetter),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[250px] max-w-4xl mx-auto" />,
  }
);


export default function IntentionPage() {
  return (
    <MainLayout title="Intention Setter">
      <IntentionSetter />
    </MainLayout>
  );
}
