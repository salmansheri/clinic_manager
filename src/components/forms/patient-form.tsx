import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordInput } from "../password-input";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormType, UserType } from "./auth-form";
import { useCreatePatient } from "@/hooks/patient/use-create-patient";
import { SignInForm } from "./sign-in";

interface PatientFormProps {
  formType: FormType;
  userType: UserType;
  initialData?: any;
}

const FormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must contain minimum of 2 characters" }),
  lastName: z.string(),
  dateOfBirth: z.date(),
  gender: z.string(),
  medicalHistory: z.string(),
  contactNumber: z.string(),
  address: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const gender = ["MALE", "FEMALE"];

export const PatientForm: React.FC<PatientFormProps> = ({
  formType,
  initialData,
  userType,
}) => {
  const createPatientMutation = useCreatePatient();
  const defaultValues: z.infer<typeof FormSchema> = initialData
    ? {
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        dateOfBirth: initialData.dateOfBirth,
        gender: initialData.gender,
        medicalHistory: initialData.medicalHistory,
        address: initialData.address,
        contactNumber: initialData.contactNumber,
        email: initialData.email,
        password: initialData.password,
      }
    : {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        medicalHistory: "",
        address: "",
        contactNumber: "",
        email: "",
        password: "",
      };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    if (formType === "SIGNUP") {
      // @ts-ignore
      createPatientMutation.mutate({ ...values });
    }
  };

  if (formType === "SIGNIN") {
    return <SignInForm userType={userType} />;
  }
  return (
    <div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          {formType === "SIGNUP" && (
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="eg: Dr. John" {...field} />
                    </FormControl>
                    <FormDescription>Enter the First Name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="eg: Doe" {...field} />
                    </FormControl>
                    <FormDescription>Enter the Last Name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Enter Date of Birth</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="eg: 95383 93838"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter Your Your Phone Number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter Your Address</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Your Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gender.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Mom has Diabetes, Father had Cancer"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter Your Your Phone Number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="eg: johndoe@gmail.com" {...field} />
                </FormControl>
                <FormDescription>Enter Your Email</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>Enter Your Password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {createPatientMutation.isPending ? (
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
    </div>
  );
};
