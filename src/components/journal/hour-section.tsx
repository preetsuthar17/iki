"use client";

import { useEffect, useRef } from "react";
import { useHourNotes } from "@/hooks/use-hour-notes";
import { formatHour } from "@/lib/utils/date";
import type { JournalEntry } from "@/lib/types/journal";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface HourSectionProps {
  hour: number;
  entry: JournalEntry | undefined;
  onSave: (hour: number, content: string) => Promise<void>;
  isCurrentHour?: boolean;
  isFocused?: boolean;
  isHovered?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onNavigateUp?: () => void;
  onNavigateDown?: () => void;
}

export function HourSection({
  hour,
  entry,
  onSave,
  isCurrentHour = false,
  isFocused = false,
  isHovered = false,
  onFocus,
  onBlur,
  onNavigateUp,
  onNavigateDown,
}: HourSectionProps) {
  const { content, handleChange, isSaving } = useHourNotes({
    hour,
    entry,
    onSave,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isFocused && textareaRef.current) {
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      });
    }
  }, [isFocused]);

  const isBlurred = !isFocused && !isHovered;
  const hasContent = content && content.trim().length > 0;
  const shouldShowPlaceholder = isCurrentHour && !hasContent;

  return (
    <div
      className={cn(
        "flex gap-3 transition-all duration-300",
        isBlurred && "opacity-30 blur-md"
      )}
    >
      <div className="flex flex-col gap-2 min-w-[60px] items-start justify-center">
        <span className="text-sm font-medium text-muted-foreground">
          {formatHour(hour)}
        </span>
        {isSaving && (
          <span className="text-xs text-muted-foreground">Saving...</span>
        )}
      </div>
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={content || ""}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={(e) => {
            const textarea = e.currentTarget;
            const cursorPosition = textarea.selectionStart || 0;
            const isAtStart = cursorPosition === 0;
            const isAtEnd = cursorPosition === textarea.value.length;
            const lines = textarea.value.split("\n");
            const currentLine = textarea.value.substring(0, cursorPosition).split("\n").length - 1;

            if (e.key === "ArrowUp" && currentLine === 0 && isAtStart) {
              e.preventDefault();
              onNavigateUp?.();
            } else if (e.key === "ArrowDown" && currentLine === lines.length - 1 && isAtEnd) {
              e.preventDefault();
              onNavigateDown?.();
            }
          }}
          placeholder={shouldShowPlaceholder ? "What's on your mind?" : ""}
          className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 px-0 bg-transparent resize-none min-h-9"
          rows={1}
        />
      </div>
    </div>
  );
}

