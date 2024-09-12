"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAppointment } from "@/hooks/appointment/use-create-appointment";
import { useGetDoctors } from "@/hooks/doctor/use-get-doctors";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import type { InitialFormDataType } from "../edit-appoinments";
import { useUpdatePatientAppointment } from "@/hooks/appointment/patient/use-update-patient-appointment";

type AppointmentFormType = "CREATE" | "UPDATE";

interface AppointmentFormProps {
  formType: AppointmentFormType;
  initialData?: InitialFormDataType;
}

const FormSchema = z.object({
  doctorId: z.string(),
  notes: z.string(),
  date: z.date(),
});

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  formType,
  initialData,
}) => {
  const router = useRouter();

  const getDoctorsQuery = useGetDoctors();
  const doctorData = getDoctorsQuery.data;
  const createAppointmentMutation = useCreateAppointment();
  const updatePatientAppointmentMutation = useUpdatePatientAppointment(
    initialData?.id as string
  );

  const defaultValues: z.infer<typeof FormSchema> = initialData
    ? {
        doctorId: initialData.doctor,
        notes: initialData.reason,
        date: new Date(initialData.date),
      }
    : {
        doctorId: "",
        notes: "",
        date: new Date(),
      };

  console.log(defaultValues);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    if (formType === "CREATE") {
      createAppointmentMutation.mutate(
        {
          date: String(values.date),
          doctorId: values.doctorId,
          notes: values.notes,
        },
        {
          onSuccess: (data) => {
            // @ts-ignore
            router.push(`/patient/success/${data?.data?.id}`);
          },
        }
      );
    }

    if (formType === "UPDATE") {
      updatePatientAppointmentMutation.mutate(
        {
          date: String(values.date),
          doctorId: values.doctorId,
          notes: values.notes,
        },
        {
          onSuccess: () => {
            router.push("/patient/appointments");
          },
        }
      );
    }
  };

  return (
    <Card className="w-[90vw] md:w-[70vw] ">
      <CardHeader>
        <CardTitle>
          {formType === "CREATE" ? (
            <>Create Appoitment</>
          ) : (
            <>Update Appoitment</>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea placeholder="eg: Fever" {...field} />
                  </FormControl>
                  <FormDescription>Reason For Appointment</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full  pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        // @ts-ignore
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            {formType === "CREATE" && (
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctorData?.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {`Dr. ${doctor.firstName} ${doctor.lastName}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full">
              {createAppointmentMutation.isPending ||
              updatePatientAppointmentMutation.isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>Submit</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
