import { Loader2 } from "lucide-react";

export const CustomLoader = () => {
  return (
    <div className="h-[90vh] flex items-center justify-center">
      <Loader2 className="size-20 animate-spin" />
    </div>
  );
};
