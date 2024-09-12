import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import prisma from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateUniqueToken() {
  const lastToken = await prisma.token.findFirst({
    orderBy: { number: "desc" },
  });

  return lastToken ? lastToken.number + 1 : 1;
}
