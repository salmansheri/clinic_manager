"use client";

import { useGetAppointment } from "@/hooks/appointment/use-get-appointment";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const SuccessClient = ({ appointmentId }: { appointmentId: string }) => {
  const router = useRouter();
  const getAppointmentQuery = useGetAppointment(appointmentId);

  if (getAppointmentQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-20 animate-spin" />
      </div>
    );
  }

  const appointmentData = getAppointmentQuery.data;
  const doctorData = getAppointmentQuery.data?.doctor;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="">
        <CardHeader>
          {" "}
          <CardTitle>Appointment Successfull</CardTitle>
          <CardDescription>
            `Your appointment with{" "}
            <strong>
              {" "}
              Dr {doctorData?.firstName} {doctorData?.lastName}{" "}
            </strong>{" "}
            is Successfull
          </CardDescription>
        </CardHeader>

        <CardContent className="">
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <p className="text-7xl">👍</p>
            </div>
            <div>
              <label>Reason </label>
              <p>{appointmentData?.notes}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="grid gap-2">
          <p>
            Doctor Name: Dr. {doctorData?.firstName} {doctorData?.lastName}
          </p>
          <p>
            Date: {format(appointmentData?.dateTime as string, "dd-MM-yyyy")}
          </p>
          <Button onClick={router.back}>Book Another Appointment</Button>
          <Button onClick={() => router.push("/patient/appointments")}>
            See All Appointments
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
