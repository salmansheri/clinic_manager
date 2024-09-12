"use client";

import { CustomButton } from "./custom-button";
import { useRouter } from "next/navigation";

export const GetStarted = () => {
  const router = useRouter();

  const onClick = (href: string) => {
    router.push(href);
  };
  return (
    <div className="space-x-5">
      <CustomButton onClick={() => onClick("/sign-up")}>
        Get Started
      </CustomButton>
      <CustomButton onClick={() => onClick("/sign-in")}>Sign in</CustomButton>
    </div>
  );
};
