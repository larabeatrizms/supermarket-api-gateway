import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class FindProductByIdDto {
  @ApiProperty()
  @IsNumberString()
  id: string;
}
