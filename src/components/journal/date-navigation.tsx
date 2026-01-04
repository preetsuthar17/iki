"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDate, formatDateDisplay } from "@/lib/utils/date";

interface DateNavigationProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateNavigation({
  selectedDate,
  onDateChange,
}: DateNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = new Date(selectedDate + "T00:00:00");

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(formatDate(date));
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>{formatDateDisplay(selectedDate)}</span>
          <span>▼</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

