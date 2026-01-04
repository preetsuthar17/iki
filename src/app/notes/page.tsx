"use client";

import { useEffect, useState } from "react";
import { LocalStorageAdapter } from "@/lib/storage/local-storage-adapter";
import type { JournalDay } from "@/lib/types/journal";
import { formatDateDisplay } from "@/lib/utils/date";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

const storage = new LocalStorageAdapter();

export default function NotesPage() {
  const [days, setDays] = useState<JournalDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllDays = async () => {
      setLoading(true);
      try {
        const allDays = await storage.getAllDays();
        setDays(allDays);
      } catch (error) {
        console.error("Failed to load days:", error);
        setDays([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllDays();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center size-full h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="flex flex-col h-screen max-w-4xl mx-auto overflow-hidden">
        <div className="shrink-0 py-12">
          <div className="flex items-center justify-between px-6">
            <h1 className="text-2xl font-semibold">Notes</h1>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to Journal
            </Link>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">No notes yet</p>
            <p className="text-sm mt-2">
              Start writing in your journal to see notes here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto overflow-hidden">
      <div className="shrink-0 py-12">
        <div className="flex items-center justify-between px-6">
          <h1 className="text-2xl font-semibold">Notes</h1>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Journal
          </Link>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-2 px-6 pb-6">
          {days.map((day) => (
            <Link
              key={day.date}
              href={`/notes/${day.date}`}
              className="text-xl font-semibold hover:text-muted-foreground transition-colors py-2"
            >
              {formatDateDisplay(day.date)}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

