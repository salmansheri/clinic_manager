import { AppointmentForm } from "@/components/forms/appointment-form";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return redirect("/sign-in");
  }
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center ">
        <AppointmentForm formType="CREATE" />
      </div>
    </div>
  );
}
