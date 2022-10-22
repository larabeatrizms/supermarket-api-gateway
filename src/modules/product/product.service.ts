import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { CreateProductDto } from './dtos/create-product.dto';

export type Product = any;

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  pingProductService() {
    const startTs = Date.now();
    return this.productClient
      .send<string>({ role: 'product', cmd: 'ping' }, {})
      .pipe(
        timeout(5000),
        map((message) => ({ message, duration: Date.now() - startTs })),
      );
  }

  async createProduct(product: CreateProductDto): Promise<Product | undefined> {
    try {
      const source$ = this.productClient
        .send({ role: 'product', cmd: 'create-product' }, product)
        .pipe(timeout(2000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Could not create a product.',
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
