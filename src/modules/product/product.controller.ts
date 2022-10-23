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

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get('/ping')
  @ApiOperation({ summary: 'Verifica se serviço está executando.' })
  pingUserService() {
    return this.service.pingProductService();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Cria um produto.' })
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() productData: CreateProductDto,
  ) {
    return this.service.createProduct(productData, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Atualiza um produto.' })
  async updateProduct(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: UpdateProductParamDto,
    @Body() product: UpdateProductBodyDto,
  ) {
    return this.service.updateProduct(params, product, file);
  }
}
