"use client";

import { usePathname, useRouter } from "next/navigation";
import { Edit, Loader2, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDoctorApproved } from "@/hooks/appointment/doctor/use-doctor-approved";

interface DoctorRowActionsProps {
  id: string;
}
export const DoctorRowActions: React.FC<DoctorRowActionsProps> = ({ id }) => {
  const pathname = usePathname();
  const approvedAppointmentMutation = useDoctorApproved();

  if (approvedAppointmentMutation.isPending) {
    return (
      <div>
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  if (
    pathname === "/doctor/appointments/approved" ||
    pathname.includes("/approved")
  ) {
    return null;
  }
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

        <DropdownMenuItem
          onClick={() => approvedAppointmentMutation.mutate({ id })}
        >
          Accept
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
