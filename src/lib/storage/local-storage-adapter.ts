import type { JournalEntry, JournalDay } from "@/lib/types/journal";
import type { JournalStorage } from "./journal-storage";

const STORAGE_PREFIX = "journal:";

function getStorageKey(date: string): string {
  return `${STORAGE_PREFIX}${date}`;
}

export class LocalStorageAdapter implements JournalStorage {
  async getEntries(date: string): Promise<JournalEntry[]> {
    if (typeof window === "undefined") {
      return [];
    }

    const key = getStorageKey(date);
    const data = localStorage.getItem(key);

    if (!data) {
      return [];
    }

    try {
      const entries: JournalEntry[] = JSON.parse(data);
      return entries;
    } catch {
      return [];
    }
  }

  async saveEntry(entry: JournalEntry): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    const key = getStorageKey(entry.date);
    const existingEntries = await this.getEntries(entry.date);

    const existingIndex = existingEntries.findIndex((e) => e.id === entry.id);

    if (existingIndex >= 0) {
      existingEntries[existingIndex] = entry;
    } else {
      existingEntries.push(entry);
    }

    localStorage.setItem(key, JSON.stringify(existingEntries));
  }

  async deleteEntry(id: string, date: string): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    const key = getStorageKey(date);
    const existingEntries = await this.getEntries(date);
    const filteredEntries = existingEntries.filter((e) => e.id !== id);

    if (filteredEntries.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(filteredEntries));
    }
  }

  async getDay(date: string): Promise<JournalDay | null> {
    const entries = await this.getEntries(date);

    if (entries.length === 0) {
      return null;
    }

    return {
      date,
      entries,
    };
  }

  async getAllDays(): Promise<JournalDay[]> {
    if (typeof window === "undefined") {
      return [];
    }

    const days: JournalDay[] = [];

    // Iterate through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const date = key.replace(STORAGE_PREFIX, "");
        const entries = await this.getEntries(date);
        
        if (entries.length > 0) {
          days.push({
            date,
            entries: entries.sort((a, b) => a.hour - b.hour),
          });
        }
      }
    }

    // Sort by date (newest first)
    return days.sort((a, b) => b.date.localeCompare(a.date));
  }
}

