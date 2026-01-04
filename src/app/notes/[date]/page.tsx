"use client";

import { useEffect, useState } from "react";
import { useJournal } from "@/hooks/use-journal";
import { HourSection } from "@/components/journal/hour-section";
import { formatDateDisplay } from "@/lib/utils/date";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DateNotesPage() {
  const params = useParams();
  const date = params.date as string;
  const {
    loading,
    saveEntry,
    getEntryForHour,
  } = useJournal(date);

  const [focusedHour, setFocusedHour] = useState<number | null>(null);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  useEffect(() => {
    if (!loading) {
      setFocusedHour(0);
    }
  }, [loading]);

  const handleHourFocus = (hour: number) => {
    setFocusedHour(hour);
    setHoveredHour(null);
  };

  const handleHourBlur = () => {};

  const handleHourHover = (hour: number) => {
    if (focusedHour !== hour) {
      setHoveredHour(hour);
    }
  };

  const handleHourLeave = () => {
    setHoveredHour(null);
  };

  const handleNavigateUp = (hour: number) => {
    if (hour > 0) {
      setFocusedHour(hour - 1);
      setHoveredHour(null);
    }
  };

  const handleNavigateDown = (hour: number) => {
    if (hour < 23) {
      setFocusedHour(hour + 1);
      setHoveredHour(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center size-full h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto overflow-hidden">
      <div className="shrink-0 py-12">
        <div className="flex items-center justify-between px-6">
          <h1 className="text-2xl font-semibold">
            {formatDateDisplay(date)}
          </h1>
          <Link
            href="/notes"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Notes
          </Link>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-2 px-6 pb-6">
          {Array.from({ length: 24 }).map((_, i) => {
            const hour = i;
            const entry = getEntryForHour(hour);
            const isFocused = focusedHour === hour;
            const isHovered = hoveredHour === hour;

            return (
              <div
                key={hour}
                onMouseEnter={() => handleHourHover(hour)}
                onMouseLeave={handleHourLeave}
              >
                <HourSection
                  hour={hour}
                  entry={entry}
                  onSave={saveEntry}
                  isCurrentHour={false}
                  isFocused={isFocused}
                  isHovered={isHovered}
                  onFocus={() => handleHourFocus(hour)}
                  onBlur={handleHourBlur}
                  onNavigateUp={() => handleNavigateUp(hour)}
                  onNavigateDown={() => handleNavigateDown(hour)}
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

