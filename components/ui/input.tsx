import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      className={cn(
        "h-11 w-full border bg-paper px-3 text-base outline-none transition-colors focus:border-amber focus:ring-1 focus:ring-amber",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
