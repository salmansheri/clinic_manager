"use client";

import {
  AppointmentColumnType,
  columns,
} from "@/app/(dashboard)/patient/appointments/columns";
import { useGetAppointments } from "@/hooks/appointment/patient/use-get-appointments";
import { Loader2 } from "lucide-react";
import { CustomCard } from "./custom-card";
import { DataTable } from "./data-table";
import { useAlertDialog } from "@/hooks/use-alert-dialog";
import { useBulkDelete } from "@/hooks/appointment/patient/use-bulk-delelte";

export const PatientAppointments = () => {
  const alertDialog = useAlertDialog();
  const bulkDeleteMutation = useBulkDelete();
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

  if (getPatientAppointmentsQuery.isLoading) {
    return (
      <div>
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }
  return (
    <CustomCard className="w-full md:w-[80vw] my-10">
      {patientAppointmentsData === undefined ? (
        <div>Cannot find</div>
      ) : (
        <div className="">
          <DataTable
            columns={columns}
            data={tableData}
            onDelete={(row) => {
              const ids = row.map((r) => {
                return r.original.id;
              });

              const payload = {
                ids,
              };

              bulkDeleteMutation.mutate(payload);
            }}
          />
        </div>
      )}
    </CustomCard>
  );
};
