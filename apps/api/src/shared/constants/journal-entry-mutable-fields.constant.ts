export const JOURNAL_ENTRY_MUTABLE_FIELDS = [
  'workDate',
  'workTypeSnapshot',
  'unitSnapshot',
  'volume',
  'workerNameSnapshot',
  'notes',
  'orderIndex',
  'conditionsText',
  'locationSection',
  'locationFloor',
  'locationAxes',
] as const;

export type JournalEntryMutableField = (typeof JOURNAL_ENTRY_MUTABLE_FIELDS)[number];
