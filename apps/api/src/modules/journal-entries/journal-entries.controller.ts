import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { JournalEntry } from '../../../generated/prisma/client';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { JournalEntryResponseDto } from './dto/journal-entry-response.dto';
import { ListJournalEntriesQueryDto } from './dto/list-journal-entries-query.dto';
import { PaginatedJournalEntriesResponseDto } from './dto/paginated-journal-entries-response.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { JournalEntriesService } from './journal-entries.service';
import type { PaginatedJournalEntries } from './types/paginated-journal-entries.type';

@ApiTags('journal-entries')
@ApiBearerAuth('access-token')
@Controller('journals/:journalId/entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  @Get()
  @ApiOperation({ summary: 'Список записей журнала (пагинация, фильтр по датам)' })
  @ApiOkResponse({ type: PaginatedJournalEntriesResponseDto })
  findAll(
    @Param('journalId') journalId: string,
    @Query() query: ListJournalEntriesQueryDto,
  ): Promise<PaginatedJournalEntries> {
    return this.journalEntriesService.findByJournal(journalId, query);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Создать запись' })
  @ApiCreatedResponse({ type: JournalEntryResponseDto })
  create(
    @Param('journalId') journalId: string,
    @Body() dto: CreateJournalEntryDto,
    @CurrentUser('sub') userId: string,
  ): Promise<JournalEntry> {
    return this.journalEntriesService.create(journalId, dto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Редактировать запись (mutable поля)' })
  @ApiOkResponse({ type: JournalEntryResponseDto })
  update(
    @Param('journalId') journalId: string,
    @Param('id') entryId: string,
    @Body() dto: UpdateJournalEntryDto,
  ): Promise<JournalEntry> {
    return this.journalEntriesService.update(journalId, entryId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить запись (soft delete)' })
  @ApiNoContentResponse()
  async softDelete(
    @Param('journalId') journalId: string,
    @Param('id') entryId: string,
  ): Promise<void> {
    await this.journalEntriesService.softDelete(journalId, entryId);
  }
}
