"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, Suspense } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { DoctorForm } from "./doctor-form";
import { PatientForm } from "./patient-form";
import { ReceptionistForm } from "./receptionist-form";

export type UserType = "DOCTOR" | "RECEPTIONIST" | "PATIENT";

export type FormType = "SIGNIN" | "SIGNUP";

interface AuthFormProps {
  type: FormType;
  initialData?: any;
}

export const AuthForm: FC<AuthFormProps> = ({ type, initialData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const title = type === "SIGNUP" ? "Sign Up" : "Sign In";

  const userType = searchParams.get("query");

  const onUserTypeChange = (user: UserType) => {
    if (type === "SIGNUP") {
      router.push(`/sign-up?query=${user}`);
    }

    if (type === "SIGNIN") {
      router.push(`/sign-in?query=${user}`);
    }
  };

  return (
    <div>
      <Card className="w-[90vw] md:w-[70vw] lg:w-[50vw]">
        <div className="p-5 grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Button onClick={() => onUserTypeChange("PATIENT")}>
            Continue as Patient
          </Button>
          <Button onClick={() => onUserTypeChange("DOCTOR")}>
            Continue as Doctor
          </Button>
          <Button onClick={() => onUserTypeChange("RECEPTIONIST")}>
            Continue as Receptionist
          </Button>
        </div>
        <CardHeader className="grid grid-cols-2 ">
          <CardTitle>{title}</CardTitle>
          {userType && (
            <Badge className="w-fit my-2 place-self-end">{userType}</Badge>
          )}
        </CardHeader>
        <CardContent>
          {userType === "DOCTOR" && (
            <DoctorForm userType={userType} formType={type} />
          )}
          {userType === "PATIENT" && (
            <PatientForm userType={userType} formType={type} />
          )}
          {userType === "RECEPTIONIST" && (
            <ReceptionistForm userType={userType} formType={type} />
          )}
        </CardContent>
        <Separator />
      </Card>
    </div>
  );
};
