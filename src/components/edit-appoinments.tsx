"use client";
import { useGetAppointment } from "@/hooks/appointment/use-get-appointment";
import { CustomLoader } from "./customLoader";
import { AppointmentForm } from "./forms/appointment-form";

interface EditAppointmentsProps {
  appointmentId: string;
}

export type InitialFormDataType = {
  id: string;
  reason: string;
  date: string;
  doctor: string;
};

export const EditAppointments: React.FC<EditAppointmentsProps> = ({
  appointmentId,
}) => {
  const getAppointmentQuery = useGetAppointment(appointmentId);

  const appointmentData = getAppointmentQuery.data;

  const initialFormData: InitialFormDataType = {
    id: appointmentData?.id,
    doctor: appointmentData?.doctorId,
    date: appointmentData?.dateTime,
    reason: appointmentData?.notes,
  } as InitialFormDataType;

  if (getAppointmentQuery.isLoading) {
    return <CustomLoader />;
  }

  return (
    <div className="flex items-center justify-center h-[90vh]">
      <AppointmentForm formType="UPDATE" initialData={initialFormData} />
    </div>
  );
};
