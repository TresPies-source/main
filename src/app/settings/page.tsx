import MainLayout from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <MainLayout title="Settings">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Account details will be available here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>About ZenJar</CardTitle>
            <CardDescription>Learn more about our mission and what's next.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>View Our Public Roadmap</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
