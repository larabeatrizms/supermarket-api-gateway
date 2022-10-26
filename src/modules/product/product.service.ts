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
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { FindProductByIdDto } from './dtos/find-product-by-id.dto';
import { UpdateCategoryBodyDto } from './dtos/update-category.dto';

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

  async createProduct(
    product: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<Product | undefined> {
    try {
      const source$ = this.productClient
        .send(
          { role: 'product', cmd: 'create-product' },
          {
            ...product,
            category_id: Number(product.category_id),
            price: Number(product.price),
            file,
          },
        )
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

  async updateProduct(
    { id }: { id: string },
    product: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<Product | undefined> {
    try {
      const source$ = this.productClient
        .send(
          { role: 'product', cmd: 'update-product' },
          {
            ...product,
            id: Number(id),
            category_id: Number(product.category_id),
            file,
          },
        )
        .pipe(timeout(5000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Could not update a product.',
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

  async findProductById({
    id,
  }: FindProductByIdDto): Promise<Product | undefined> {
    try {
      const source$ = this.productClient
        .send(
          { role: 'product', cmd: 'find-product-by-id' },
          {
            id: Number(id),
          },
        )
        .pipe(timeout(5000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Não foi possível encontrar o produto.',
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

  async createCategory(
    category: CreateCategoryDto,
    image: Express.Multer.File,
  ): Promise<Product | undefined> {
    try {
      const source$ = this.productClient
        .send(
          { role: 'category', cmd: 'create-category' },
          { ...category, image },
        )
        .pipe(timeout(5000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Could not create a category.',
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

  async updateCategory(
    { id }: { id: string },
    category: UpdateCategoryBodyDto,
    file: Express.Multer.File,
  ): Promise<Product | undefined> {
    try {
      const source$ = this.productClient
        .send(
          { role: 'category', cmd: 'update-category' },
          { ...category, id: Number(id), image: file },
        )
        .pipe(timeout(5000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Não foi possível atualizar categoria!.',
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
