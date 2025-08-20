// DateTimePicker.tsx
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

interface DateTimePickerProps {
  label: string;
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  time: string;
  setTime: (t: string) => void;
}

export function DateTimePicker({ label, date, setDate, time, setTime }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Label>{label}</Label>
      <div className="flex gap-4">
        {/* Date Picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-1/2 justify-between font-normal border-gray-200 shadow-xs">
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon className="w-4 h-4 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto bg-white overflow-hidden p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>

        {/* Time Picker */}
        <Input
          type="time"
          step="1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-background border-gray-200 shadow-xs appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </div>
    </div>
  );
}
