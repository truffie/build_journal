export type ProjectJournalSummary = {
  readonly id: string;
  readonly title: string | null;
};

export type ProjectDashboardItem = {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly createdAt: Date;
  readonly journal: ProjectJournalSummary;
};
