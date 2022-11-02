import { ApiProperty } from '@nestjs/swagger';

import { IsNumberString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNumberString()
  customer_id: string;
}
