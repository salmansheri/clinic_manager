"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCancelAppointment } from "@/hooks/appointment/doctor/use-cancel-appointment";
import { useDoctorApproved } from "@/hooks/appointment/doctor/use-doctor-approved";
import { Loader2, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

interface DoctorRowActionsProps {
  id: string;
}
export const DoctorRowActions: React.FC<DoctorRowActionsProps> = ({ id }) => {
  const pathname = usePathname();
  const approvedAppointmentMutation = useDoctorApproved();
  const cancelAppointmentMutation = useCancelAppointment();

  if (
    approvedAppointmentMutation.isPending ||
    cancelAppointmentMutation.isPending
  ) {
    return (
      <div>
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  const isApproved = pathname === "/doctor/appointments/approved";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {isApproved ? (
          <DropdownMenuItem
            onClick={() => cancelAppointmentMutation.mutate({ id })}
          >
            Cancel
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => approvedAppointmentMutation.mutate({ id })}
          >
            Accept
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
