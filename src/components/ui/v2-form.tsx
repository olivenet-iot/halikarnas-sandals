"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// V2 input wrapper
export const V2Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    required?: boolean;
  }
>(({ label, error, required, className, ...props }, ref) => {
  return (
    <div>
      <label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted mb-2 block">
        {label} {required && <span className="text-v2-accent">*</span>}
      </label>
      <input
        ref={ref}
        className={cn(
          "w-full px-0 pb-2 bg-transparent border-0 border-b border-v2-border-subtle",
          "text-v2-text-primary text-sm outline-none",
          "focus:border-v2-text-primary transition-colors duration-200",
          "placeholder:text-v2-text-muted/50",
          error && "border-red-400 focus:border-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});
V2Input.displayName = "V2Input";

// V2 select wrapper
export const V2Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    error?: string;
    required?: boolean;
  }
>(({ label, error, required, children, className, ...props }, ref) => {
  return (
    <div>
      <label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted mb-2 block">
        {label} {required && <span className="text-v2-accent">*</span>}
      </label>
      <select
        ref={ref}
        className={cn(
          "w-full px-0 pb-2 bg-transparent border-0 border-b border-v2-border-subtle",
          "text-v2-text-primary text-sm outline-none appearance-none cursor-pointer",
          "focus:border-v2-text-primary transition-colors duration-200",
          error && "border-red-400 focus:border-red-400",
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B6560'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0px center",
          backgroundSize: "20px",
        }}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});
V2Select.displayName = "V2Select";

// V2 textarea wrapper
export const V2Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
    required?: boolean;
  }
>(({ label, error, required, className, ...props }, ref) => {
  return (
    <div>
      <label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted mb-2 block">
        {label} {required && <span className="text-v2-accent">*</span>}
      </label>
      <textarea
        ref={ref}
        className={cn(
          "w-full px-0 pb-2 bg-transparent border-0 border-b border-v2-border-subtle",
          "text-v2-text-primary text-sm outline-none resize-none min-h-[80px]",
          "focus:border-v2-text-primary transition-colors duration-200",
          "placeholder:text-v2-text-muted/50",
          error && "border-red-400 focus:border-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});
V2Textarea.displayName = "V2Textarea";
