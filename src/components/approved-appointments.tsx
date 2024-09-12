"use client";

import {
  columns,
  AppointmentColumnType,
} from "@/app/(dashboard)/doctor/columns";
import { CustomCard } from "./custom-card";
import { DataTable } from "./data-table";
import { useGetTodaysAppointmens } from "@/hooks/appointment/doctor/use-get-todays-appointments";
import { CustomLoader } from "./customLoader";
import { format } from "date-fns";
import { toast } from "sonner";

export const ApprovedAppointments = () => {
  const getApprovedAppointmentsQuery = useGetTodaysAppointmens();

  const approvedAppointmentsData = getApprovedAppointmentsQuery.data;
  const todayDate = format(new Date(), "dd-MM-yyyy");

  const filterApprovedAppointments = approvedAppointmentsData?.filter(
    (appointment) =>
      format(appointment.dateTime, "dd-MM-yyyy") === todayDate &&
      appointment.status === "APPROVED"
  );

  const tableData = filterApprovedAppointments?.map((appointment) => {
    return {
      id: appointment.id,
      patient: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      reason: appointment.notes,
      date: appointment.dateTime,
      status: appointment.status,
    };
  }) as AppointmentColumnType[];

  if (getApprovedAppointmentsQuery.isLoading) {
    return <CustomLoader />;
  }

  if (!approvedAppointmentsData || approvedAppointmentsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <CustomCard>
          <h1 className="text-xl md:text-2xl">No Appointmens Today</h1>
        </CustomCard>
      </div>
    );
  }

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <CustomCard className="w-full md:w-[80vw]">
        <h2 className="text-xl md:text-2xl font-bold">Approved Appointments</h2>
        <DataTable
          columns={columns}
          data={tableData}
          onDelete={() => {
            toast.error("Not Allowed");
          }}
        />
      </CustomCard>
    </div>
  );
};
