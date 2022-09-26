import { ApiPropertyOptional } from '@nestjs/swagger';

export class MovieQueryDto {
  @ApiPropertyOptional({
    default: 1,
  })
  page?: number;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  genre?: string;

  @ApiPropertyOptional()
  year?: string;

  @ApiPropertyOptional()
  average?: boolean;

  @ApiPropertyOptional()
  start_year: string;

  @ApiPropertyOptional()
  finish_year: string;
}
