import type * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'field-sizing-content flex min-h-16 w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-base text-white shadow-sm outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'selection:bg-primary selection:text-primary-foreground placeholder:text-slate-500',
        'focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20',
        'aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20',
        className
      )}
      data-slot="textarea"
      {...props}
    />
  )
}

export { Textarea }
