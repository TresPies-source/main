import MainLayout from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <MainLayout title="Settings">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Account details will be available here once authentication is set up.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
