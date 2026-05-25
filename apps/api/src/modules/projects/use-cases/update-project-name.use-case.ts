import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

export type ProjectNameResult = {
  readonly id: string;
  readonly name: string;
};

@Injectable()
export class UpdateProjectNameUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(projectId: string, name: string): Promise<ProjectNameResult> {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Объект не найден');
    }
    return this.prisma.project.update({
      where: { id: projectId },
      data: { name: name.trim() },
      select: { id: true, name: true },
    });
  }
}
