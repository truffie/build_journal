import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkTypeResponseDto } from './dto/work-type-response.dto';
import { WorkTypesService } from './work-types.service';
import type { WorkTypeItem } from './use-cases/list-work-types.use-case';

@ApiTags('work-types')
@ApiBearerAuth('access-token')
@Controller('work-types')
export class WorkTypesController {
  constructor(private readonly workTypesService: WorkTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Справочник видов работ' })
  @ApiOkResponse({ type: WorkTypeResponseDto, isArray: true })
  findAll(): Promise<WorkTypeItem[]> {
    return this.workTypesService.findAll();
  }
}
