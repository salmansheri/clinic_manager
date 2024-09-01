interface AppointmentPageProps {
  params: {
    appointmentId: string;
  };
}

export default function AppointmentPage({ params }: AppointmentPageProps) {
  const { appointmentId } = params;
  return <div>{appointmentId}</div>;
}
