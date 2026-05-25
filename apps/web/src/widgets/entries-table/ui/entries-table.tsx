'use client';

import { ArrowDown, ArrowUp, CircleHelp, Pencil, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { JournalEntry, PaginatedJournalEntries } from '@/entities/journal-entry';
import { formatDisplayDate } from '@/shared/lib';
import { EntriesPagination } from './entries-pagination';

type EntriesTableProps = {
  readonly data: PaginatedJournalEntries | null;
  readonly isLoading: boolean;
  readonly sortDate: 'asc' | 'desc';
  readonly onToggleSortDate: () => void;
  readonly onEdit: (entry: JournalEntry) => void;
  readonly onDelete: (entry: JournalEntry) => void;
  readonly onPageChange: (page: number) => void;
};

const CELL = 'px-3 py-2.5 align-middle';
const HEAD = 'px-3 py-2.5 text-xs font-semibold text-muted-foreground';

export const EntriesTable = memo(function EntriesTable({
  data,
  isLoading,
  sortDate,
  onToggleSortDate,
  onEdit,
  onDelete,
  onPageChange,
}: EntriesTableProps): React.ReactElement {
  if (isLoading) {
    return <p className="text-muted-foreground px-4 py-8 text-center text-sm">Загрузка записей…</p>;
  }
  if (!data || data.items.length === 0) {
    return <p className="text-muted-foreground px-4 py-8 text-center text-sm">Нет записей по заданным параметрам</p>;
  }
  const DateSortIcon = sortDate === 'asc' ? ArrowUp : ArrowDown;
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:p-4">
      <div className="scrollbar-thin min-h-0 flex-1 overflow-auto rounded-lg border border-border/60">
        <Table className="min-w-[780px] text-sm">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-background shadow-[0_1px_0_0_hsl(var(--border)/0.6)] hover:bg-background">
              <TableHead className={`${HEAD} w-[108px]`}>
                <button
                  type="button"
                  className="flex items-center gap-1.5 font-semibold"
                  onClick={onToggleSortDate}
                >
                  Дата
                  <DateSortIcon className="size-3.5 opacity-60" />
                </button>
              </TableHead>
              <TableHead className={`${HEAD} min-w-[140px]`}>Вид работ</TableHead>
              <TableHead className={`${HEAD} w-[72px] text-right`}>Объём</TableHead>
              <TableHead className={`${HEAD} w-[50px]`}>Ед.</TableHead>
              <TableHead className={`${HEAD} min-w-[120px]`}>Исполнитель</TableHead>
              <TableHead className={`${HEAD} w-[70px]`}>Секция</TableHead>
              <TableHead className={`${HEAD} w-[56px]`}>Этаж</TableHead>
              <TableHead className={`${HEAD} w-[80px]`}>Оси</TableHead>
              <TableHead className={`${HEAD} w-[100px] text-right`} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-muted/20">
                <TableCell className={`${CELL} text-muted-foreground tabular-nums text-xs`}>
                  {formatDisplayDate(entry.workDate)}
                </TableCell>
                <TableCell className={`${CELL} max-w-[200px] font-medium`}>
                  <span className="line-clamp-2">{entry.workTypeSnapshot}</span>
                </TableCell>
                <TableCell className={`${CELL} text-right tabular-nums`}>{entry.volume}</TableCell>
                <TableCell className={`${CELL} text-muted-foreground`}>
                  {entry.unitSnapshot}
                </TableCell>
                <TableCell className={`${CELL} max-w-[160px]`}>
                  <span className="line-clamp-1">{entry.workerNameSnapshot}</span>
                </TableCell>
                <TableCell className={`${CELL} text-xs`}>
                  {entry.locationSection || '—'}
                </TableCell>
                <TableCell className={`${CELL} text-xs`}>
                  {entry.locationFloor || '—'}
                </TableCell>
                <TableCell className={`${CELL} text-xs`}>
                  {entry.locationAxes || '—'}
                </TableCell>
                <TableCell className={`${CELL} text-right`}>
                  <div className="flex items-center justify-end gap-0.5">
                    {entry.notes ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 text-sky-600 hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-sky-950/40"
                            aria-label="Примечание"
                          >
                            <CircleHelp className="size-3.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="max-w-xs text-sm">
                          <p className="mb-1 font-medium text-sky-700 dark:text-sky-300">Примечание</p>
                          <p className="text-muted-foreground leading-relaxed">{entry.notes}</p>
                        </PopoverContent>
                      </Popover>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 hover:text-warning"
                      onClick={() => onEdit(entry)}
                      aria-label="Редактировать"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(entry)}
                      aria-label="Удалить"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EntriesPagination
        page={data.page}
        totalPages={data.totalPages}
        total={data.total}
        limit={data.limit}
        onPageChange={onPageChange}
      />
    </div>
  );
});
