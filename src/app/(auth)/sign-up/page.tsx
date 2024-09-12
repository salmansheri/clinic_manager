import { AuthForm } from "@/components/forms/auth-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign up | Clinic Manager",
  description: "Developed By Salman Sheriff",
};

export default function SignUp() {
  return (
    <Suspense>
      <div className="my-5">
        <AuthForm type="SIGNUP" />
      </div>
    </Suspense>
  );
}
