"use client";

import {
  AppointmentColumnType,
  columns,
} from "@/app/(dashboard)/receptionist/columns";
import { useGetApprovedAppointmens } from "@/hooks/appointment/receptionist/use-get-approved-appointment";
import { format } from "date-fns";
import { toast } from "sonner";
import { CustomCard } from "./custom-card";
import { CustomLoader } from "./customLoader";
import { DataTable } from "./data-table";

export const Receptionist = () => {
  const getApprovedAppointmentsQuery = useGetApprovedAppointmens();

  const approvedAppointmentsData = getApprovedAppointmentsQuery.data;
  // console.log(approvedAppointmentsData);
  const todayDate = format(new Date(), "dd-MM-yyyy");

  const filterApprovedAppointments = approvedAppointmentsData?.filter(
    (appointment) =>
      format(appointment.dateTime, "dd-MM-yyyy") === todayDate &&
      appointment.status === "APPROVED"
  );

  console.log(filterApprovedAppointments);

  const tableData = filterApprovedAppointments?.map((appointment) => {
    return {
      id: appointment.id,
      patient: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      reason: appointment.notes,
      date: appointment.dateTime,
      status: appointment.status,
      tokenNumber: appointment?.token?.number,
      tokenStatus: appointment?.token?.status,
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
    <div className="min-h-[90vh] flex items-center justify-center my-10">
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
