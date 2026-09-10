import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberAz(value: number, digits = 1) {
  return new Intl.NumberFormat("az-AZ", {
    maximumFractionDigits: digits,
  }).format(value);
}
