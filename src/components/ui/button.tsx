import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-95 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          'glass bg-gradient-to-br from-orange-400/40 to-orange-500/30 hover:from-orange-400/50 hover:to-orange-500/40 text-foreground font-semibold shadow-md hover:shadow-lg',
        destructive:
          'glass bg-gradient-to-br from-red-500/40 to-red-600/30 hover:from-red-500/50 hover:to-red-600/40 text-red-700 dark:text-red-300 font-semibold shadow-md hover:shadow-lg',
        outline:
          'glass border-none bg-white/40 dark:bg-slate-800/40 hover:bg-white/50 dark:hover:bg-slate-800/50 text-foreground shadow-sm hover:shadow-md',
        secondary:
          'glass bg-gradient-to-br from-orange-300/40 to-orange-400/30 hover:from-orange-300/50 hover:to-orange-400/40 text-orange-900 dark:text-orange-200 font-semibold shadow-md hover:shadow-lg',
        ghost:
          'hover:bg-white/30 dark:hover:bg-slate-800/30 text-foreground transition-colors duration-200',
        link: 'text-primary underline-offset-4 hover:underline no-underline transition-all',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 rounded-lg px-6 has-[>svg]:px-4 text-base',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
