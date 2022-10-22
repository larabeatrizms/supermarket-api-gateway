import { ApiProperty } from '@nestjs/swagger';

import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class UserAddress {
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

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserAddress)
  address: UserAddress;
}
