import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { type CreateProjectDto } from '../dto/create-project.dto';
import { type CreateProjectResult } from '../types/create-project-result.type';

@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateProjectDto, createdById: string): Promise<CreateProjectResult> {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: dto.name.trim(),
          createdById,
        },
      });
      const journal = await tx.workJournal.create({
        data: {
          projectId: project.id,
          title: dto.journalTitle.trim(),
          createdById,
        },
      });
      return { project, journal };
    });
  }
}
