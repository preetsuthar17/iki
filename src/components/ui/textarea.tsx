'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'resize-vertical scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground scrollbar-corner-transparent flex min-h-[60px] w-full rounded-ele border border-border bg-input px-3 py-2 text-sm shadow-sm/2 ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-border',
        destructive: 'border-destructive focus-visible:ring-destructive',
        ghost:
          'border-transparent bg-accent focus-visible:border-border focus-visible:bg-input',
      },
      size: {
        default: 'min-h-[80px] px-3 py-2',
        sm: 'min-h-[60px] px-3 py-2 text-xs',
        lg: 'min-h-[100px] px-4 py-2',
        xl: 'min-h-[120px] px-6 py-3 text-base',
        fixed: 'h-[80px] resize-none px-3 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  error?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant, size, error, clearable, onClear, value, ...props },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      props.defaultValue || ''
    );
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Combine external ref with internal ref
    React.useImperativeHandle(ref, () => textareaRef.current!);

    const textareaVariant = error ? 'destructive' : variant;

    // Determine if this is a controlled component
    const isControlled = value !== undefined;
    const textareaValue = isControlled ? value : internalValue;
    const showClearButton =
      clearable && textareaValue && String(textareaValue).length > 0;

    const handleTextareaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      props.onChange?.(e);
    };

    const handleClear = () => {
      // Clear the internal state for uncontrolled inputs
      if (!isControlled) {
        setInternalValue('');
      }

      // Call the onClear callback if provided
      onClear?.();

      // Create a synthetic event to trigger onChange with empty value
      if (textareaRef.current) {
        const textarea = textareaRef.current;

        // Set the textarea's value directly
        textarea.value = '';

        // Create a synthetic React ChangeEvent
        const syntheticEvent = {
          target: textarea,
          currentTarget: textarea,
          nativeEvent: new Event('input', { bubbles: true }),
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          persist: () => {},
          preventDefault: () => {},
          stopPropagation: () => {},
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 0,
          isTrusted: true,
          timeStamp: Date.now(),
          type: 'change',
        } as React.ChangeEvent<HTMLTextAreaElement>;

        // Trigger the onChange handler
        props.onChange?.(syntheticEvent);

        // Focus the textarea after clearing
        textarea.focus();
      }
    };

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            textareaVariants({ variant: textareaVariant, size, className }),
            showClearButton && 'pe-10'
          )}
          ref={textareaRef}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'hsl(var(--hu-border)) transparent',
          }}
          {...(isControlled
            ? { value: textareaValue }
            : { defaultValue: props.defaultValue })}
          onChange={handleTextareaChange}
          {...(({ defaultValue, ...rest }) => rest)(props)}
        />
        {/* Clear button */}
        {showClearButton && (
          <div className="absolute end-3 top-3 z-10 flex items-center gap-1">
            <button
              className="text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4 [&_svg]:shrink-0"
              onClick={handleClear}
              tabIndex={-1}
              type="button"
            >
              <X />
            </button>
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
