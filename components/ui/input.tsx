import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-lg border bg-paper px-3 text-base outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
