
'use client';

import MainLayout from "@/components/layout/main-layout";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const TaskManager = dynamic(
  () => import('@/components/features/tasks/task-manager').then(mod => mod.TaskManager),
  { 
    ssr: false,
    loading: () => (
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="h-[365px] w-full" />
        <Skeleton className="h-[365px] w-full" />
      </div>
    ),
  }
);


export default function TasksPage() {
  return (
    <MainLayout title="Task Jar">
      <TaskManager />
    </MainLayout>
  );
}
