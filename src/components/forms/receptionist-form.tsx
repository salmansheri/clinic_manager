import { useCreateReceptionist } from "@/hooks/receptionist/use-create-receptionist";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordInput } from "../password-input";
import { Button } from "../ui/button";
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
import { FormType, UserType } from "./auth-form";

interface ReceptionistFormProps {
  formType: FormType;
  userType?: UserType;
  initialData?: any;
}

const FormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must contain minimum of 2 characters" }),
  lastName: z.string(),

  contactNumber: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const gender = ["MALE", "FEMALE"];

export const ReceptionistForm: React.FC<ReceptionistFormProps> = ({
  formType,
  initialData,
}) => {
  const createReceptionistMutation = useCreateReceptionist();
  const defaultValues: z.infer<typeof FormSchema> = initialData
    ? {
        firstName: initialData.firstName,
        lastName: initialData.lastName,

        contactNumber: initialData.contactNumber,
        email: initialData.email,
        password: initialData.password,
      }
    : {
        firstName: "",
        lastName: "",

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
      createReceptionistMutation.mutate({
        ...values,
      });
    }
  };
  return (
    <div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          {formType === "SIGNUP" && (
            <>
              <div className="lg:flex items-center gap-2 justify-between">
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
              </div>

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
            {createReceptionistMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
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
