import { Module } from '@nestjs/common';
import { ListWorkTypesUseCase } from './use-cases/list-work-types.use-case';
import { WorkTypesController } from './work-types.controller';
import { WorkTypesService } from './work-types.service';

@Module({
  controllers: [WorkTypesController],
  providers: [WorkTypesService, ListWorkTypesUseCase],
})
export class WorkTypesModule {}
