import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'size-])]:size-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all [&_svg:not([class*= focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-primary/20',
        destructive:
          'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500/20',
        outline:
          'border border-slate-700 bg-slate-800/50 text-white shadow-sm hover:border-slate-600 hover:bg-slate-700/50 focus-visible:ring-slate-500/20',
        secondary:
          'bg-slate-700 text-white shadow-sm hover:bg-slate-600 focus-visible:ring-slate-500/20',
        ghost:
          'text-white hover:bg-slate-800/50 focus-visible:ring-slate-500/20',
        link: 'text-primary underline-offset-4 hover:underline focus-visible:ring-primary/20',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  )
}

export { Button, buttonVariants }
