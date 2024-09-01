import { Header } from "@/components/header";
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
    </div>
  );
}
