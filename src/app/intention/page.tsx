import MainLayout from "@/components/layout/main-layout";
import { IntentionSetter } from "@/components/features/intention/intention-setter";

export default function IntentionPage() {
  return (
    <MainLayout title="Intention Setter">
      <IntentionSetter />
    </MainLayout>
  );
}
