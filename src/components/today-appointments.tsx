"use client";

import {
  AppointmentColumnType,
  columns,
} from "@/app/(dashboard)/doctor/columns";
import { useGetTodaysAppointmens } from "@/hooks/appointment/doctor/use-get-todays-appointments";
import { format } from "date-fns";
import { toast } from "sonner";
import { CustomCard } from "./custom-card";
import { CustomLoader } from "./customLoader";
import { DataTable } from "./data-table";

export const TodaysAppointments = () => {
  const getTodaysAppointmentsQuery = useGetTodaysAppointmens();

  const todaysAppointmentsData = getTodaysAppointmentsQuery.data;
  const todayDate = format(new Date(), "dd-MM-yyyy");

  const filterTodaysAppointments = todaysAppointmentsData?.filter(
    (appointment) =>
      format(appointment.dateTime, "dd-MM-yyyy") === todayDate &&
      appointment.status === "SHEDULED"
  );

  const tableData = filterTodaysAppointments?.map((appointment) => {
    return {
      id: appointment.id,
      patient: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      reason: appointment.notes,
      date: appointment.dateTime,
      status: appointment.status,
    };
  }) as AppointmentColumnType[];

  console.log(tableData);

  if (getTodaysAppointmentsQuery.isLoading) {
    return <CustomLoader />;
  }

  if (!todaysAppointmentsData || todaysAppointmentsData.length === 0) {
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
        <h2 className="text-xl md:text-2xl font-bold">
          Up Coming Appointments
        </h2>
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
