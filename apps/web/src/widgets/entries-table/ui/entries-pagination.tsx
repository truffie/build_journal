'use client';

import { memo, useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type EntriesPaginationProps = {
  readonly page: number;
  readonly totalPages: number;
  readonly total: number;
  readonly limit: number;
  readonly onPageChange: (page: number) => void;
};

const VISIBLE_START = 5;

function buildPageSlots(current: number, total: number): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  if (total <= VISIBLE_START + 1) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const slots: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
  for (let i = 1; i <= VISIBLE_START; i += 1) {
    slots.push(i);
  }
  const needsCurrentInMiddle = current > VISIBLE_START && current < total;
  if (needsCurrentInMiddle) {
    slots.push('ellipsis-start');
    slots.push(current);
    if (current < total - 1) {
      slots.push('ellipsis-end');
    }
  } else if (current <= VISIBLE_START) {
    slots.push('ellipsis-start');
  } else {
    slots.push('ellipsis-start');
  }
  slots.push(total);
  return slots;
}

export const EntriesPagination = memo(function EntriesPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: EntriesPaginationProps): React.ReactElement {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const slots = useMemo(() => buildPageSlots(page, totalPages), [page, totalPages]);
  return (
    <div className="flex flex-col items-center justify-between gap-2 px-1 sm:flex-row">
      <p className="text-muted-foreground whitespace-nowrap text-xs">
        {total}&nbsp;записей&nbsp;·&nbsp;{start}–{end}
      </p>
      {totalPages > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
              />
            </PaginationItem>
            {slots.map((slot) => {
              if (slot === 'ellipsis-start' || slot === 'ellipsis-end') {
                return (
                  <PaginationItem key={slot}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return (
                <PaginationItem key={slot}>
                  <PaginationLink
                    href="#"
                    isActive={slot === page}
                    onClick={(event) => {
                      event.preventDefault();
                      onPageChange(slot);
                    }}
                  >
                    {slot}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (page < totalPages) onPageChange(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
});
