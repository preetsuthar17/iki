"use client";

import { useState, useEffect, useCallback } from "react";
import type { JournalEntry } from "@/lib/types/journal";

interface UseHourNotesProps {
  hour: number;
  entry: JournalEntry | undefined;
  onSave: (hour: number, content: string) => Promise<void>;
}

export function useHourNotes({ hour, entry, onSave }: UseHourNotesProps) {
  const [content, setContent] = useState(entry?.content || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContent(entry?.content || "");
  }, [entry]);

  const debouncedSave = useCallback(
    async (value: string) => {
      setIsSaving(true);
      try {
        await onSave(hour, value);
      } finally {
        setIsSaving(false);
      }
    },
    [hour, onSave]
  );

  useEffect(() => {
    if (content === undefined) return;

    const timeoutId = setTimeout(() => {
      debouncedSave(content);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [content, debouncedSave]);

  const handleChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  return {
    content,
    handleChange,
    isSaving,
  };
}

