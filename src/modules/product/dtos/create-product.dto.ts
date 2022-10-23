import { ApiProperty } from '@nestjs/swagger';

import { IsNumberString, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumberString()
  price: string;
}
