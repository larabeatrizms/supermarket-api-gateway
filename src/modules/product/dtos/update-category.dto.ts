import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class UpdateCategoryParamDto {
  @ApiProperty({ type: 'number' })
  @IsString()
  id: string;
}

export class UpdateCategoryBodyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
}
