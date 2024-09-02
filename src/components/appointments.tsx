"use client";

import {
  AppointmentColumnType,
  columns,
} from "@/app/(dashboard)/patient/appointments/columns";
import { useGetAppointments } from "@/hooks/appointment/patient/use-get-appointments";
import { Loader2 } from "lucide-react";
import { CustomCard } from "./custom-card";
import { DataTable } from "./data-table";

export const PatientAppointments = () => {
  const getPatientAppointmentsQuery = useGetAppointments();

  const patientAppointmentsData = getPatientAppointmentsQuery.data;

  const tableData = patientAppointmentsData?.map((data) => {
    return {
      id: data.id,
      doctor: `Dr. ${data.doctor.firstName} ${data.doctor.lastName}`,
      date: data.dateTime,
      reason: data.notes,
      status: data.status,
    };
  }) as AppointmentColumnType[] | [];

  console.log(`Patient data : ${tableData}`);

  if (getPatientAppointmentsQuery.isLoading) {
    return (
      <div>
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }
  return (
    <CustomCard className="w-full md:w-[80vw]">
      {patientAppointmentsData === undefined ? (
        <div>Cannot find</div>
      ) : (
        <div>
          <DataTable columns={columns} data={tableData} />
        </div>
      )}
    </CustomCard>
  );
};
