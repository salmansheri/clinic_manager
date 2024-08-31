"use client";

import { FormType, UserType } from "./auth-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PasswordInput } from "../password-input";
import { useCreateDoctor } from "@/hooks/doctor/use-create-doctor";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { SignInForm } from "./sign-in";

interface DoctorFormProps {
  formType: FormType;
  userType: UserType;
  initialData?: any;
}

const FormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must contain minimum of 2 characters" })
    .optional(),
  lastName: z.string().optional(),
  spacialization: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
});

export const DoctorForm: React.FC<DoctorFormProps> = ({
  formType,
  initialData,
  userType,
}) => {
  // console.log(formType);
  const createDoctorMutation = useCreateDoctor();
  const defaultValues: z.infer<typeof FormSchema> = initialData
    ? {
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        spacialization: initialData.specialization,
        contactNumber: initialData.contactNumber,
        email: initialData.email,
        password: initialData.password,
      }
    : {
        firstName: "",
        lastName: "",
        spacialization: "",
        contactNumber: "",
        email: "",
        password: "",
      };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  // console.log(userType);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (formType === "SIGNUP") {
      // @ts-ignore
      createDoctorMutation.mutate({ ...values });
      return;
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
              <div className="md:flex items-center justify-between gap-2">
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
              <div className="md:flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="spacialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="eg: Surgeon" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter Your Specialization in field
                      </FormDescription>
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
              </div>
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
            {createDoctorMutation.isPending ? (
              <>
                <Loader2 className="animate-spin size-4" />
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
