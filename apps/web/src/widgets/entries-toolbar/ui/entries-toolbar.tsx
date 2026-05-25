'use client';

import { CalendarIcon, Download, Plus, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { memo, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateRangeLabel } from '@/shared/lib';
import type { DateRange, Matcher } from 'react-day-picker';

type EntriesToolbarProps = {
  readonly fromDate: string | null;
  readonly toDate: string | null;
  readonly minDate: string | null;
  readonly maxDate: string | null;
  readonly onDateRangeChange: (from: string | null, to: string | null) => void;
  readonly onResetDateRange: () => void;
  readonly onNewEntry: () => void;
};

export const EntriesToolbar = memo(function EntriesToolbar({
  fromDate,
  toDate,
  minDate,
  maxDate,
  onDateRangeChange,
  onResetDateRange,
  onNewEntry,
}: EntriesToolbarProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>(() => ({
    from: fromDate ? new Date(fromDate) : undefined,
    to: toDate ? new Date(toDate) : undefined,
  }));
  const disabledDays = useMemo((): Matcher[] => {
    const matchers: Matcher[] = [];
    if (minDate) matchers.push({ before: new Date(minDate) });
    if (maxDate) matchers.push({ after: new Date(maxDate) });
    return matchers;
  }, [minDate, maxDate]);
  const handleOpen = (next: boolean): void => {
    if (next) {
      setPendingRange({
        from: fromDate ? new Date(fromDate) : undefined,
        to: toDate ? new Date(toDate) : undefined,
      });
    }
    setOpen(next);
  };
  const handleApply = (): void => {
    const from = pendingRange?.from ? format(pendingRange.from, 'yyyy-MM-dd') : null;
    const to = pendingRange?.to ? format(pendingRange.to, 'yyyy-MM-dd') : null;
    onDateRangeChange(from, to);
    setOpen(false);
  };
  const hasActiveFilter = Boolean(fromDate || toDate);
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 px-3 py-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <Popover open={open} onOpenChange={handleOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-normal">
              <CalendarIcon className="size-3.5 opacity-60" />
              {formatDateRangeLabel(fromDate ?? undefined, toDate ?? undefined)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              locale={ru}
              selected={pendingRange}
              onSelect={setPendingRange}
              numberOfMonths={2}
              disabled={disabledDays}
              defaultMonth={minDate ? new Date(minDate) : undefined}
            />
            <div className="flex justify-end gap-2 border-t px-3 py-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button size="sm" onClick={handleApply}>
                Применить
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        {hasActiveFilter ? (
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={onResetDateRange}>
            <X className="size-3" />
            Сбросить
          </Button>
        ) : null}
      </div>
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" disabled>
          <Download className="size-3.5" />
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" disabled>
          <Upload className="size-3.5" />
        </Button>
        <Button size="sm" className="gap-1.5" onClick={onNewEntry}>
          <Plus className="size-3.5" />
          Новая запись
        </Button>
      </div>
    </div>
  );
});
