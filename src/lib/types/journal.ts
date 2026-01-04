export interface JournalEntry {
  id: string;
  date: string;
  hour: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalDay {
  date: string;
  entries: JournalEntry[];
}

