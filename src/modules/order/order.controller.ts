import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrderDto } from './dtos/create-order.dto';
import {
  UpdateOrderBodyDto,
  UpdateOrderParamDto,
} from './dtos/update-order-status.dto';
import { FindOrderByIdDto } from './dtos/find-order-by-id.dto';

@Controller()
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @ApiTags('Serviços')
  @Get('order/ping')
  @ApiOperation({ summary: 'Verifica se serviço está executando.' })
  pingUserService() {
    return this.service.pingOrderService();
  }

  @ApiTags('Pedido')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'customer')
  @Post('order')
  @ApiOperation({ summary: 'Cria um pedido.' })
  async createOrder(@Body() orderData: CreateOrderDto) {
    return this.service.createOrder(orderData);
  }

  @ApiTags('Pedido')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'customer')
  @Patch('order/:id')
  @ApiOperation({ summary: 'Atualiza o status de um pedido.' })
  async updateOrderStatus(
    @Param() params: UpdateOrderParamDto,
    @Body() order: UpdateOrderBodyDto,
    @Request() req,
  ) {
    return this.service.updateOrderStatus(params, order, req.user);
  }

  @ApiTags('Pedido')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @Get('order/:id')
  @ApiOperation({ summary: 'Busca um pedido pelo ID.' })
  async findOrderById(@Param() params: FindOrderByIdDto) {
    return this.service.findOrderById(params);
  }

  @ApiTags('Pedido')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @Get('order')
  @ApiOperation({ summary: 'Busca pedidos de acordo com o usuário logado.' })
  async findOrderByFields(@Request() req) {
    return this.service.findOrdersByFields(req.user);
  }
}
