import { EditAppointments } from "@/components/edit-appoinments";

interface EditAppointmentProps {
  params: {
    appointmentId: string;
  };
}
export default function EditAppointmentPage({ params }: EditAppointmentProps) {
  return <EditAppointments appointmentId={params.appointmentId} />;
}
