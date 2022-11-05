import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

import { EOrderPaymentType } from '../enums/order-payment-type.enum';

class CreateOrderShipmentDto {
  @ApiProperty()
  @IsString()
  to_address: string;

  @ApiProperty()
  @IsString()
  zipcode: string;
}
class CreateOrderPaymentDto {
  @ApiProperty({ enum: EOrderPaymentType })
  @IsEnum(EOrderPaymentType)
  type: EOrderPaymentType;
}

class CreateOrderItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  product_id: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  customer_id: number;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateOrderShipmentDto)
  shipment: CreateOrderShipmentDto;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateOrderPaymentDto)
  payment: CreateOrderPaymentDto;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
