"use client";

import React, { useEffect, useState } from "react";
import { useJournal } from "@/hooks/use-journal";
import { HourSection } from "./hour-section";
import { formatDate, formatDateDisplay } from "@/lib/utils/date";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export function JournalPage() {
  const currentDate = formatDate(new Date());
  const {
    loading,
    saveEntry,
    getEntryForHour,
  } = useJournal(currentDate);

  const currentHour = new Date().getHours();

  const [focusedHour, setFocusedHour] = useState<number | null>(currentHour);
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  useEffect(() => {
    if (!loading) {
      setFocusedHour(currentHour);
      const timer = setTimeout(() => {
        setFocusedHour(currentHour);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentHour, loading]);

  const handleHourFocus = (hour: number) => {
    setFocusedHour(hour);
    setHoveredHour(null);
  };

  const handleHourBlur = () => {
    // Don't clear focus if we're moving to another hour
    // The focus will be set by handleHourFocus
  };

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
      const prevHour = hour - 1;
      setFocusedHour(prevHour);
      setHoveredHour(null);
      // Focus will be handled by HourSection's useEffect when isFocused changes
    }
  };

  const handleNavigateDown = (hour: number) => {
    if (hour < 23) {
      const nextHour = hour + 1;
      setFocusedHour(nextHour);
      setHoveredHour(null);
      // Focus will be handled by HourSection's useEffect when isFocused changes
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center size-full max-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto overflow-hidden">
      <div className="shrink-0 py-12">
        <div className="flex items-center justify-between px-6">
          <h1 className="text-2xl font-semibold">
            {formatDateDisplay(currentDate)}
          </h1>
          <Link
            href="/notes"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View Notes
          </Link>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-2 px-6 pb-6">
          {Array.from({ length: 24 }).map((_, i) => {
            const hour = i;
            const isCurrentHour = hour === currentHour;
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
                  isCurrentHour={isCurrentHour}
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

