import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberAz(value: number, digits = 1) {
  // Some browsers lack Azerbaijani ICU data and fall back to English.
  // Map explicit separators so server and browser output always agree.
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  })
    .formatToParts(value)
    .map(({ type, value: part }) =>
      type === "group" ? "." : type === "decimal" ? "," : part,
    )
    .join("");
}
