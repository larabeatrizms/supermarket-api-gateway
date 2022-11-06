import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNumberString } from 'class-validator';
import { EOrderStatusCode } from '../enums/order-status-code.enum';

export class UpdateOrderParamDto {
  @ApiProperty({ type: 'number' })
  @IsNumberString()
  id: string;
}

export class UpdateOrderBodyDto {
  @ApiProperty({ enum: EOrderStatusCode })
  @IsEnum(EOrderStatusCode)
  status: EOrderStatusCode;
}
