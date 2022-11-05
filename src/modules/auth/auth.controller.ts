import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignInDto } from './dtos/signin.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@ApiTags('Autenticação')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Session created!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Dados incorretos!',
  })
  @ApiOperation({ summary: 'Cria sessão de usuário.' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Body() signInDto: SignInDto) {
    return this.authService.login(req.user);
  }

  @Post('auth/forgot-password')
  @ApiOperation({ summary: 'Envia email para mudança de senha.' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Busca o usuário logado.' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
