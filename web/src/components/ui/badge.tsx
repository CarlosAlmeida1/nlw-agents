import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 font-medium text-xs transition-all focus-visible:ring-2 focus-visible:ring-primary/20 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'border-transparent bg-slate-700 text-white hover:bg-slate-600',
        destructive:
          'border-transparent bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/20',
        outline: 'border-slate-700 text-white hover:bg-slate-800/50',
        blue: 'border-blue-800 bg-blue-950/50 text-blue-300 hover:bg-blue-900/50',
        emerald:
          'border-emerald-800 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/50',
        purple:
          'border-purple-800 bg-purple-950/50 text-purple-300 hover:bg-purple-900/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      data-slot="badge"
      {...props}
    />
  )
}

export { Badge, badgeVariants }
