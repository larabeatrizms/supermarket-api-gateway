import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class FindOrderByIdDto {
  @ApiProperty()
  @IsNumberString()
  id: string;
}
