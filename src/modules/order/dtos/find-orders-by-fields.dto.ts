import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class FindOrdersByFieldsDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  user_id?: number;
}
