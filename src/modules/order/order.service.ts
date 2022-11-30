import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { IUserSession } from '../auth/interfaces/user-session.interface';
import { CreateOrderDto } from './dtos/create-order.dto';
import { FindOrderByIdDto } from './dtos/find-order-by-id.dto';
import { FindOrdersByFieldsDto } from './dtos/find-orders-by-fields.dto';
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
        .pipe(timeout(100000));

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
    order: UpdateOrderBodyDto,
  ): Promise<Order | undefined> {
    try {
      const source$ = this.orderClient
        .send(
          { role: 'order', cmd: 'update-order-status' },
          { ...order, id: Number(id) },
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

  async findOrderById({ id }: FindOrderByIdDto): Promise<Order | undefined> {
    try {
      const source$ = this.orderClient
        .send(
          { role: 'order', cmd: 'find-order-by-id' },
          {
            id: Number(id),
          },
        )
        .pipe(timeout(20000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Não foi possível encontrar o pedido.',
      });

      if (
        !result ||
        result.status === 'error' ||
        (result.status &&
          typeof result.status === 'number' &&
          result.status !== HttpStatus.OK)
      ) {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(error ? error.message : error);
    }
  }

  async findOrdersByFields(
    userSession: IUserSession,
  ): Promise<Order | undefined> {
    try {
      const data: FindOrdersByFieldsDto = {};

      if (userSession.role !== 'admin') {
        data.user_id = userSession.userId;
      }

      const source$ = this.orderClient
        .send({ role: 'order', cmd: 'find-orders-by-fields' }, data)
        .pipe(timeout(100000));

      const result = await lastValueFrom(source$, {
        defaultValue:
          'Não foi possível encontrar pedidos com os campos selecionados.',
      });

      if (
        !result ||
        result.status === 'error' ||
        (result.status && result.status !== HttpStatus.OK)
      ) {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(error ? error.message : error);
    }
  }
}
