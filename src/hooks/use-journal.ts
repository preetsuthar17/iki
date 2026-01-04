"use client";

import { useState, useEffect, useCallback } from "react";
import type { JournalEntry, JournalDay } from "@/lib/types/journal";
import { LocalStorageAdapter } from "@/lib/storage/local-storage-adapter";
import type { JournalStorage } from "@/lib/storage/journal-storage";
import { formatDate } from "@/lib/utils/date";

const storage: JournalStorage = new LocalStorageAdapter();

function generateEntryId(date: string, hour: number): string {
  return `${date}-${hour}`;
}

export function useJournal(initialDate?: string) {
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || formatDate(new Date())
  );
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const loadedEntries = await storage.getEntries(date);
      setEntries(loadedEntries);
    } catch (error) {
      console.error("Failed to load entries:", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries(selectedDate);
  }, [selectedDate, loadEntries]);

  const saveEntry = useCallback(
    async (hour: number, content: string) => {
      const now = new Date().toISOString();
      const entryId = generateEntryId(selectedDate, hour);

      const existingEntry = entries.find((e) => e.id === entryId);

      const entry: JournalEntry = {
        id: entryId,
        date: selectedDate,
        hour,
        content,
        createdAt: existingEntry?.createdAt || now,
        updatedAt: now,
      };

      try {
        await storage.saveEntry(entry);
        setEntries((prev) => {
          const filtered = prev.filter((e) => e.id !== entryId);
          return [...filtered, entry];
        });
      } catch (error) {
        console.error("Failed to save entry:", error);
      }
    },
    [selectedDate, entries]
  );

  const getEntryForHour = useCallback(
    (hour: number): JournalEntry | undefined => {
      return entries.find((e) => e.hour === hour);
    },
    [entries]
  );

  return {
    selectedDate,
    entries,
    loading,
    saveEntry,
    getEntryForHour,
  };
}

