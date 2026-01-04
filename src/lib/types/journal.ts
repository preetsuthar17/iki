export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  hour: number; // 0-23
  content: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface JournalDay {
  date: string; // YYYY-MM-DD format
  entries: JournalEntry[];
}

