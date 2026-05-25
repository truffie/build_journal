import { type Project, type WorkJournal } from '../../../../generated/prisma/client';

export type CreateProjectResult = {
  readonly project: Project;
  readonly journal: WorkJournal;
};
