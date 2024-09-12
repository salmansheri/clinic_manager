import { SuccessClient } from "@/components/success-client";

interface AppointmentPageProps {
  params: {
    appointmentId: string;
  };
}

export default function AppointmentPage({ params }: AppointmentPageProps) {
  const { appointmentId } = params;

  return <SuccessClient appointmentId={appointmentId} />;
}
