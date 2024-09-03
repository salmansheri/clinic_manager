"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export const Header = () => {
  const navLinks = [
    {
      id: 1,
      title: "Appointments",
      href: "/patient/appointments",
    },
  ];
  return (
    <header className="flex items-center h-20 justify-between px-5 md:px-20 lg:px-36">
      <nav>
        {navLinks.map((link) => (
          <Link key={link.id} href={link.href}>
            {link.title}
          </Link>
        ))}
      </nav>
      <Button
        onClick={() =>
          signOut({
            callbackUrl: "/sign-in",
          })
        }
      >
        <LogOut className="size-4  mr-2" />
        Logout
      </Button>
    </header>
  );
};
