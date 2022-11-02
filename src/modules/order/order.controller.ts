import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller()
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @ApiTags('Order')
  @Get('order/ping')
  @ApiOperation({ summary: 'Verifica se serviço está executando.' })
  pingUserService() {
    return this.service.pingOrderService();
  }

  @ApiTags('Order')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('order')
  @ApiOperation({ summary: 'Cria um produto.' })
  async createOrder(@Body() productData: CreateOrderDto) {
    return this.service.createOrder(productData);
  }
}
