import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
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
import { FindProductByIdDto } from './dtos/find-product-by-id.dto';
import { FindProductsByFieldsDto } from './dtos/find-products-by-fields.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DeleteProductDto } from './dtos/delete-product.dto';
import { DeleteCategoryDto } from './dtos/delete-category.dto';

@Controller()
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @ApiTags('Serviços')
  @Get('product/ping')
  @ApiOperation({ summary: 'Verifica se serviço está executando.' })
  pingUserService() {
    return this.service.pingProductService();
  }

  @ApiTags('Produto')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('product')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Cria um produto.' })
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() productData: CreateProductDto,
  ) {
    return this.service.createProduct(productData, file);
  }

  @ApiTags('Produto')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @Get('product')
  @ApiOperation({ summary: 'Busca produtos por campos específicos.' })
  async findProductsByFields(@Query() query: FindProductsByFieldsDto) {
    return this.service.findProductsByFields(query);
  }

  @ApiTags('Produto')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @Get('product/:id')
  @ApiOperation({ summary: 'Busca um produto pelo ID.' })
  async findProductById(@Param() params: FindProductByIdDto) {
    return this.service.findProductById(params);
  }

  @ApiTags('Produto')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('product/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Atualiza um produto.' })
  async updateProduct(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: UpdateProductParamDto,
    @Body() product: UpdateProductBodyDto,
  ) {
    return this.service.updateProduct(params, product, file);
  }

  @ApiTags('Categoria')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('category')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Cria uma categoria.' })
  async createCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() categoryData: CreateCategoryDto,
  ) {
    return this.service.createCategory(categoryData, image);
  }

  @ApiTags('Categoria')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('category/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Atualiza uma categoria.' })
  async updateCategory(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: UpdateCategoryParamDto,
    @Body() category: UpdateCategoryBodyDto,
  ) {
    return this.service.updateCategory(params, category, file);
  }

  @ApiTags('Produto')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('product/:id')
  @ApiOperation({ summary: 'Deleta um produto pelo ID.' })
  async deleteProduct(@Param() params: DeleteProductDto) {
    return this.service.deleteProduct(params);
  }

  @ApiTags('Categoria')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('category/:id')
  @ApiOperation({ summary: 'Deleta uma categoria pelo ID.' })
  async deleteCategory(@Param() params: DeleteCategoryDto) {
    return this.service.deleteCategory(params);
  }
}
