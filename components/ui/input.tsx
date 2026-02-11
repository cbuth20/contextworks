import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-contextworks-steel bg-white px-3 py-2 text-sm text-contextworks-silver ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-contextworks-silver-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-contextworks-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
