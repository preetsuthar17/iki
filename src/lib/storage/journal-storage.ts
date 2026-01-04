import type { JournalEntry, JournalDay } from "@/lib/types/journal";

export interface JournalStorage {
  getEntries(date: string): Promise<JournalEntry[]>;
  saveEntry(entry: JournalEntry): Promise<void>;
  deleteEntry(id: string, date: string): Promise<void>;
  getDay(date: string): Promise<JournalDay | null>;
  getAllDays(): Promise<JournalDay[]>;
}

