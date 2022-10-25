import { ApiProperty } from '@nestjs/swagger';

import { IsNumberString, IsString } from 'class-validator';

export class UpdateProductParamDto {
  @ApiProperty({ type: 'number' })
  @IsString()
  id: string;
}

export class UpdateProductBodyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: 'number' })
  @IsNumberString()
  price: string;

  @ApiProperty({ type: 'number' })
  @IsNumberString()
  category_id: string;
}
