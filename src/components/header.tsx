import { ModeToggle } from "./mode-toggle";

export const Header = () => {
  return (
    <header className="flex items-center h-20 justify-between px-5 md:px-20 lg:px-36">
      <nav></nav>
      <div>
        <ModeToggle />
      </div>
    </header>
  );
};
