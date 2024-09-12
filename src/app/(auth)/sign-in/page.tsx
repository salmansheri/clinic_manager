import { AuthForm } from "@/components/forms/auth-form";
import { Suspense } from "react";

export default function SignIn() {
  return (
    <Suspense>
      <AuthForm type="SIGNIN" />
    </Suspense>
  );
}
