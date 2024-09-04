"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { PatientRowActions } from "@/components/patient-row-actions";
import { DoctorRowActions } from "@/components/doctor-row-actions";
import { ReceptionistRowAction } from "@/components/receptionist-row-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AppointmentColumnType = {
  id: string;
  patient: string;
  date: string;
  reason: string;
  status: string;
  tokenNumber?: number;
  tokenStatus?: string;
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
    accessorKey: "patient",
    header: "Patient",
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
    accessorKey: "tokenNumber",
    header: "Token Number",
    cell: ({ row }) => {
      const tokenNumber = row.original.tokenNumber;

      if (!tokenNumber) return null;

      return <div>{row.original.tokenNumber}</div>;
    },
  },
  {
    accessorKey: "tokenStatus",
    header: "Token Status",
    cell: ({ row }) => {
      const tokenStatus = row.original.tokenStatus;

      if (!tokenStatus) return null;

      return <div>{row.original.tokenStatus}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ReceptionistRowAction id={row.original.id} />;
    },
  },
];
