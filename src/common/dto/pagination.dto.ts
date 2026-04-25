import { IsInt, IsOptional, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  
  @ApiProperty({ example: 1, description: 'Número de página', required: false, default: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ example: 10, description: 'Resultados por página', required: false, default: 10 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;
}