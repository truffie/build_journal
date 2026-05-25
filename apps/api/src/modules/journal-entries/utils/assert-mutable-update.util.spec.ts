import { BadRequestException } from '@nestjs/common';
import { assertJournalEntryMutableUpdate } from './assert-mutable-update.util';

describe('assertJournalEntryMutableUpdate', () => {
  it('allows mutable fields', () => {
    expect(() =>
      assertJournalEntryMutableUpdate({
        notes: 'ok',
        volume: 10,
        workDate: '2026-01-01',
      }),
    ).not.toThrow();
  });

  it('rejects unknown fields', () => {
    expect(() => assertJournalEntryMutableUpdate({ id: 'entry-1' })).toThrow(BadRequestException);
    expect(() => assertJournalEntryMutableUpdate({ id: 'entry-1' })).toThrow(/нельзя изменить/);
  });

  it('ignores undefined keys', () => {
    expect(() =>
      assertJournalEntryMutableUpdate({ notes: 'x', workDate: undefined }),
    ).not.toThrow();
  });
});
