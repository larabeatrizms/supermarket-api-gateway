import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UpdateProductBodyDto,
  UpdateProductParamDto,
} from './dtos/update-product.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import {
  UpdateCategoryBodyDto,
  UpdateCategoryParamDto,
} from './dtos/update-category.dto';

@Controller()
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @ApiTags('Product')
  @Get('product/ping')
  @ApiOperation({ summary: 'Verifica se serviço está executando.' })
  pingUserService() {
    return this.service.pingProductService();
  }

  @ApiTags('Product')
  @Post('product')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Cria um produto.' })
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() productData: CreateProductDto,
  ) {
    return this.service.createProduct(productData, file);
  }

  @ApiTags('Product')
  @Put('product/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Atualiza um produto.' })
  async updateProduct(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: UpdateProductParamDto,
    @Body() product: UpdateProductBodyDto,
  ) {
    return this.service.updateProduct(params, product, file);
  }

  @ApiTags('Category')
  @Post('category')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Cria uma categoria.' })
  async createCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() categoryData: CreateCategoryDto,
  ) {
    return this.service.createCategory(categoryData, image);
  }

  @ApiTags('Category')
  @Put('category/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Atualiza uma categoria.' })
  async updateCategory(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: UpdateCategoryParamDto,
    @Body() category: UpdateCategoryBodyDto,
  ) {
    return this.service.updateCategory(params, category, file);
  }
}
