import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateUserAddressParamDto {
  @ApiProperty({ type: 'number' })
  @IsString()
  address_id: string;
}

export class UpdateUserAddressBodyDto {
  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[0-9]{5}[0-9]{3}$/)
  postalCode: string;

  @ApiProperty()
  @IsNumber()
  number: number;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  neighborhood: string;

  @ApiProperty()
  @IsOptional()
  complement?: string;
}
