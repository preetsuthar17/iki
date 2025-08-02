'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const tooltipVariants = cva(
  'z-50 overflow-hidden rounded-lg border border-border bg-card px-3 py-1.5 text-card-foreground text-xs shadow-sm/2',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        dark: 'border-foreground bg-foreground text-background',
        light: 'border-border bg-background text-foreground',
        destructive:
          'border-destructive bg-destructive text-primary-foreground',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipProvider = TooltipPrimitive.Provider;

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, size, sideOffset = 4, ...props }, ref) => {
  const [_isVisible, setIsVisible] = React.useState(false);

  return (
    <AnimatePresence>
      <TooltipPrimitive.Content
        asChild
        className={cn('relative', className)}
        onAnimationEnd={() => setIsVisible(false)}
        onAnimationStart={() => setIsVisible(true)}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      >
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={cn(tooltipVariants({ variant, size }), className)}
          exit={{ opacity: 0, scale: 0.8, y: 5 }}
          initial={{ opacity: 0, scale: 0.8, y: 5 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            duration: 0.1,
          }}
        >
          {props.children}
        </motion.div>
      </TooltipPrimitive.Content>
    </AnimatePresence>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  tooltipVariants,
  type TooltipContentProps,
};
