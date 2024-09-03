import { cn } from "@/lib/utils";

export const CustomCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("custom-card p-5", className)}>{children}</div>;
};
