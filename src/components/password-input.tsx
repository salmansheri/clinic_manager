"use client";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: () => void;
}

export const PasswordInput: React.FC<Props> = ({ value, onChange }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [type, setType] = useState("password");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="relative">
      {type === "password" ? (
        <Eye
          className="size-6 absolute top-2 right-2"
          onClick={() => setType("text")}
        />
      ) : (
        <EyeOff
          className="size-6 absolute top-2 right-2"
          onClick={() => setType("password")}
        />
      )}

      <Input type={type} value={value} onChange={onChange} />
    </div>
  );
};
