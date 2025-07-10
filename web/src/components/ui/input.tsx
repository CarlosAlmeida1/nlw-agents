import type * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-1 text-base text-white shadow-sm outline-none transition-all file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-sm file:text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'selection:bg-primary selection:text-primary-foreground placeholder:text-slate-500',
        'focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20',
        'aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20',
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  )
}

export { Input }
