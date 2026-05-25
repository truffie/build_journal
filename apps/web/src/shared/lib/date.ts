import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDisplayDate(isoDate: string): string {
  const date = parseISO(isoDate.length === 10 ? isoDate : isoDate.slice(0, 10));
  return format(date, 'dd.MM.yyyy', { locale: ru });
}

export function toApiDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateRangeLabel(from?: string, to?: string): string {
  if (!from && !to) {
    return '';
  }
  if (from && to) {
    return `${formatDisplayDate(from)} — ${formatDisplayDate(to)}`;
  }
  if (from) {
    return `с ${formatDisplayDate(from)}`;
  }
  return `до ${formatDisplayDate(to!)}`;
}
