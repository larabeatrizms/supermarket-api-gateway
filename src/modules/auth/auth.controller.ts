import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Auth')
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
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Body() signInDto: SignInDto) {
    return this.authService.login(req.user);
  }

  @Post('auth/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
