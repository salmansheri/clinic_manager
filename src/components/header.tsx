import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

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
    </header>
  );
};
