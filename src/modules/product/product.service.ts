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
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { DeleteCategoryDto } from './dtos/delete-category.dto';
import { DeleteProductDto } from './dtos/delete-product.dto';
import { FindProductByIdDto } from './dtos/find-product-by-id.dto';
import { FindProductsByFieldsDto } from './dtos/find-products-by-fields.dto';
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
        timeout(20000),
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
        .pipe(timeout(100000));

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

  async findProductsByFields(
    data: FindProductsByFieldsDto,
  ): Promise<Product | undefined> {
    try {
      const source$ = this.productClient
        .send({ role: 'product', cmd: 'find-products-by-fields' }, data)
        .pipe(timeout(100000));

      const result = await lastValueFrom(source$, {
        defaultValue:
          'Não foi possível encontrar produtos com os campos selecionados.',
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

  async findProductById(
    { id }: FindProductByIdDto,
    userSession: IUserSession,
  ): Promise<Product | undefined> {
    const data = {
      id: Number(id),
      show_pricing_history: userSession.role === 'admin',
    };

    try {
      const source$ = this.productClient
        .send({ role: 'product', cmd: 'find-product-by-id' }, data)
        .pipe(timeout(100000));

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
        .pipe(timeout(20000));

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
        .pipe(timeout(20000));

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

  async deleteProduct({ id }: DeleteProductDto): Promise<void> {
    try {
      const source$ = this.productClient
        .send(
          { role: 'product', cmd: 'delete-product' },
          {
            id: Number(id),
          },
        )
        .pipe(timeout(20000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Não foi possível deletar o produto.',
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

  async deleteCategory({ id }: DeleteCategoryDto): Promise<void> {
    try {
      const source$ = this.productClient
        .send(
          { role: 'category', cmd: 'delete-category' },
          {
            id: Number(id),
          },
        )
        .pipe(timeout(20000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Não foi possível deletar a categoria.',
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
