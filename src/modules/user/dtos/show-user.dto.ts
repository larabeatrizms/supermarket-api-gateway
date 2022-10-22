import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ShowUserDto {
  @ApiProperty({ type: 'number' })
  @IsString()
  id: string;
}
