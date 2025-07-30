import MainLayout from "@/components/layout/main-layout";
import { TaskManager } from "@/components/features/tasks/task-manager";

export default function TasksPage() {
  return (
    <MainLayout title="Task Jar">
      <TaskManager />
    </MainLayout>
  );
}
