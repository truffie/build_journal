import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProjectNameDto {
  @ApiProperty({ example: 'ЖК «Южный», корпус 3' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;
}
