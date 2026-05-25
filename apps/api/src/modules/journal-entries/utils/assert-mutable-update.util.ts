import { BadRequestException } from '@nestjs/common';
import { JOURNAL_ENTRY_MUTABLE_FIELDS } from '../../../shared/constants/journal-entry-mutable-fields.constant';

/**
 * Rejects PATCH payloads that contain unknown fields not in the mutable list.
 */
export function assertJournalEntryMutableUpdate(payload: Record<string, unknown>): void {
  const forbiddenKeys = Object.keys(payload).filter((key) => {
    if (payload[key] === undefined) {
      return false;
    }
    return !JOURNAL_ENTRY_MUTABLE_FIELDS.includes(
      key as (typeof JOURNAL_ENTRY_MUTABLE_FIELDS)[number],
    );
  });
  if (forbiddenKeys.length === 0) {
    return;
  }
  throw new BadRequestException(`Поля записи нельзя изменить: ${forbiddenKeys.join(', ')}`);
}
