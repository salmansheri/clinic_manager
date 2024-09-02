import { cn } from "@/lib/utils";

export const CustomCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("custom-card p-3", className)}>{children}</div>;
};
