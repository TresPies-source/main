
'use client';

import MainLayout from "@/components/layout/main-layout";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const TaskManager = dynamic(() => import('@/components/features/tasks/task-manager').then(mod => mod.TaskManager), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[800px]" />
});


export default function TasksPage() {
  return (
    <MainLayout title="Task Jar">
      <TaskManager />
    </MainLayout>
  );
}
