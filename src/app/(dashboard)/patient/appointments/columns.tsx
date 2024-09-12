"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { PatientRowActions } from "@/components/patient-row-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AppointmentColumnType = {
  id: string;
  doctor: string;
  date: string;
  reason: string;
  status: string;
};

export const columns: ColumnDef<AppointmentColumnType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "doctor",
    header: "Doctor",
  },
  {
    accessorKey: "Date",
    header: "date",
    cell: ({ row }) => {
      return <div>{format(row.original.date, "dd-MM-yyyy")}</div>;
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <PatientRowActions id={row.original.id} />;
    },
  },
];
