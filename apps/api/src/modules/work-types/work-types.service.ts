import { Injectable } from '@nestjs/common';
import { type WorkTypeItem } from './use-cases/list-work-types.use-case';
import { ListWorkTypesUseCase } from './use-cases/list-work-types.use-case';

@Injectable()
export class WorkTypesService {
  constructor(private readonly listWorkTypesUseCase: ListWorkTypesUseCase) {}

  findAll(): Promise<WorkTypeItem[]> {
    return this.listWorkTypesUseCase.execute();
  }
}
