import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

export type WorkTypeItem = {
  readonly id: number;
  readonly name: string;
  readonly defaultUnit: string;
  readonly sortOrder: number;
};

@Injectable()
export class ListWorkTypesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<WorkTypeItem[]> {
    const items = await this.prisma.workType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, defaultUnit: true, sortOrder: true },
    });
    return items;
  }
}
