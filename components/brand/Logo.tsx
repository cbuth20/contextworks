import { cn } from '@/lib/utils'

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-7 w-7', className)}
    >
      <rect width="32" height="32" rx="6" fill="#0A0A0A" />
      <rect x="5" y="5" width="3" height="22" rx="1" fill="#C8F55A" />
      <rect x="5" y="5" width="10" height="3" rx="1" fill="#C8F55A" />
      <rect x="5" y="24" width="10" height="3" rx="1" fill="#C8F55A" />
      <rect x="24" y="5" width="3" height="22" rx="1" fill="#F5F2EC" />
      <rect x="17" y="5" width="10" height="3" rx="1" fill="#F5F2EC" />
      <rect x="17" y="24" width="10" height="3" rx="1" fill="#F5F2EC" />
      <circle cx="16" cy="11" r="2.5" fill="#C8F55A" />
      <rect x="15" y="13.5" width="2" height="7" rx="1" fill="#C8F55A" opacity="0.3" />
      <circle cx="16" cy="23" r="2.5" fill="#C8F55A" />
      <circle cx="16" cy="16.5" r="1.8" fill="#F5F2EC" opacity="0.5" />
    </svg>
  )
}

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoIcon />
      {showText && (
        <span className="text-lg font-semibold tracking-tight">
          Context<span className="text-brand">Works</span>
        </span>
      )}
    </span>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return <LogoIcon className={className} />
}
