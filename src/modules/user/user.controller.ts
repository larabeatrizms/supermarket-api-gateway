import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ShowUserDto } from './dtos/show-user.dto';
import { UpdateUserDto } from './dtos/update-user-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  UpdateUserAddressBodyDto,
  UpdateUserAddressParamDto,
} from './dtos/update-user-address.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('Serviços')
  @Get('/ping')
  @ApiOperation({ summary: 'Verifica se serviço está executando.' })
  pingUserService() {
    return this.userService.pingUserService();
  }

  @ApiTags('Usuário')
  @Post()
  @ApiOperation({ summary: 'Cria um usuário.' })
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @ApiTags('Usuário')
  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @ApiOperation({ summary: 'Busca um usuário pelo ID.' })
  showUser(@Param() data: ShowUserDto) {
    return this.userService.showUser(data);
  }

  @ApiTags('Usuário')
  @Patch('/profile/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @ApiOperation({ summary: 'Editar perfil de um usuário.' })
  updateUserProfile(
    @Param() params: Pick<UpdateUserDto, 'user_id'>,
    @Body() body: Omit<UpdateUserDto, 'user_id'>,
  ) {
    return this.userService.updateUserProfile({
      ...params,
      ...body,
    });
  }

  @ApiTags('Usuário')
  @Put('/address/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @ApiOperation({ summary: 'Editar endereço de um usuário.' })
  updateUserAddress(
    @Param() params: UpdateUserAddressParamDto,
    @Body() body: UpdateUserAddressBodyDto,
  ) {
    return this.userService.updateUserAddress(params, body);
  }

  @ApiTags('Usuário')
  @Patch('/password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer', 'admin')
  @ApiOperation({ summary: 'Editar a senha de um usuário.' })
  async updateUserPassword(
    @Request() req,
    @Body() body: UpdateUserPasswordDto,
  ): Promise<boolean> {
    return this.userService.updateUserPassword(req.user.userId, body);
  }
}
