"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAssignToken } from "@/hooks/appointment/receptionist/use-assign-token";
import { useCallToken } from "@/hooks/appointment/receptionist/use-call-token";
import { Loader2, MoreHorizontal } from "lucide-react";

interface ReceptionistRowActionProps {
  id: string;
}
export const ReceptionistRowAction: React.FC<ReceptionistRowActionProps> = ({
  id,
}) => {
  const assignTokenMutation = useAssignToken();
  const callTokenMutation = useCallToken();

  if (assignTokenMutation.isPending || callTokenMutation.isPending) {
    return (
      <div>
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
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
        <DropdownMenuItem onClick={() => assignTokenMutation.mutate({ id })}>
          Assign Token
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => callTokenMutation.mutate({ id })}>
          Call
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => {}}>Cancel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
