import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { type ProjectDashboardItem } from '../types/project-dashboard-item.type';

@Injectable()
export class ListProjectsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<ProjectDashboardItem[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        journals: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    });
    return projects.map((project) => {
      const journal = project.journals[0];
      if (!journal) {
        throw new NotFoundException(`Project ${project.id} has no journal`);
      }
      return {
        id: project.id,
        name: project.name,
        status: project.status,
        createdAt: project.createdAt,
        journal: {
          id: journal.id,
          title: journal.title,
        },
      };
    });
  }
}
