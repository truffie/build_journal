import { Module } from '@nestjs/common';
import { JournalEntriesController } from './journal-entries.controller';
import { JournalEntriesService } from './journal-entries.service';
import { CreateJournalEntryUseCase } from './use-cases/create-journal-entry.use-case';
import { ListJournalEntriesUseCase } from './use-cases/list-journal-entries.use-case';
import { SoftDeleteJournalEntryUseCase } from './use-cases/soft-delete-journal-entry.use-case';
import { UpdateJournalEntryUseCase } from './use-cases/update-journal-entry.use-case';

@Module({
  controllers: [JournalEntriesController],
  providers: [
    JournalEntriesService,
    ListJournalEntriesUseCase,
    CreateJournalEntryUseCase,
    UpdateJournalEntryUseCase,
    SoftDeleteJournalEntryUseCase,
  ],
})
export class JournalEntriesModule {}
