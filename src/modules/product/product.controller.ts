import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @ApiOperation({ summary: 'Cria um usuário.' })
  createUser(
    @UploadedFile() file: Express.Multer.File,
    // @Body() product: CreateProductDto,
  ) {
    console.log('file', file);
    // return this.service.createProduct(product);
  }
}
