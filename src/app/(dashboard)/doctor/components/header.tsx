"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { LogOut, Menu, SheetIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { signOut } from "next-auth/react";
import { useDoctorMenuSheet } from "@/hooks/use-doctor-menu-sheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Header = () => {
  const navLinks = [
    {
      id: 1,
      title: "Home",
      href: "/doctor",
    },
    {
      id: 2,
      title: "Approved Appointments",
      href: "/doctor/appointments/approved",
    },
  ];

  const router = useRouter();
  const doctorMenuSheet = useDoctorMenuSheet();

  const date = new Date();
  const todayDate = format(date, "dd-MM-yyyy");
  return (
    <header className="h-20 flex items-center px-10 md:px-20 lg:px-36 justify-between">
      <h1 className="font-bold  md:text-2xl lg:text-3xl">
        Today Appointment ({todayDate})
      </h1>
      <div>
        <Sheet
          open={doctorMenuSheet.isOpen}
          onOpenChange={doctorMenuSheet.onClose}
        >
          <Button onClick={doctorMenuSheet.onOpen} size="icon" variant="ghost">
            <Menu className="size-4" />
          </Button>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-10 space-y-3">
              {navLinks.map((link) => (
                <Button
                  className="w-full flex justify-start"
                  variant="ghost"
                  key={link.id}
                  onClick={() => {
                    router.push(link.href);
                    doctorMenuSheet.onClose();
                  }}
                >
                  {link.title}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  signOut({
                    callbackUrl: "/sign-in",
                  })
                }
              >
                <LogOut className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};
