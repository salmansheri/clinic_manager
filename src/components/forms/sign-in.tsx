"use client";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PasswordInput } from "../password-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { UserType } from "./auth-form";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const SignInForm = ({ userType }: { userType: UserType }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getCallbackUrl = () => {
    switch (userType) {
      case "DOCTOR":
        return "/doctor";

      case "PATIENT":
        return "/patient";

      case "RECEPTIONIST":
        return "/receptionist";
    }
  };

  const callBackUrl = getCallbackUrl();

  console.log(callBackUrl);

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    signIn("credentials", {
      email: values.email,
      password: values.password,
      type: userType,
      callbackUrl: callBackUrl,
    });
  };
  return (
    <div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
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
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
