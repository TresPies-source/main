
'use client';

import MainLayout from "@/components/layout/main-layout";
import { WinJar } from "@/components/features/wins/win-jar";

export default function WinsPage() {
  return (
    <MainLayout title="Win Jar">
      <WinJar />
    </MainLayout>
  );
}
