import MainLayout from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

        <Card>
          <CardHeader>
            <CardTitle>About ZenJar & Our Roadmap</CardTitle>
            <CardDescription>
              Learn more about our mission, philosophy, and what's next on our journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/public/about">Learn More About ZenJar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
