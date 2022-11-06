import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { CreateOrderDto } from './dtos/create-order.dto';
import {
  UpdateOrderBodyDto,
  UpdateOrderParamDto,
} from './dtos/update-order-status.dto';

export type Order = any;

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderClient: ClientProxy,
  ) {}

  pingOrderService() {
    const startTs = Date.now();
    return this.orderClient
      .send<string>({ role: 'order', cmd: 'ping' }, {})
      .pipe(
        timeout(5000),
        map((message) => ({ message, duration: Date.now() - startTs })),
      );
  }

  async createOrder(order: CreateOrderDto): Promise<Order | undefined> {
    try {
      const source$ = this.orderClient
        .send({ role: 'order', cmd: 'create-order' }, order)
        .pipe(timeout(2000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Could not create a order.',
      });

      if (!result || result.status === 'error') {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(error);
    }
  }

  async updateOrderStatus(
    { id }: UpdateOrderParamDto,
    category: UpdateOrderBodyDto,
  ): Promise<Order | undefined> {
    try {
      const source$ = this.orderClient
        .send(
          { role: 'order', cmd: 'update-order-status' },
          { ...category, id: Number(id) },
        )
        .pipe(timeout(20000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Não foi possível atualizar o pedido!.',
      });

      if (!result || result.status === 'error') {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(error);
    }
  }
}
