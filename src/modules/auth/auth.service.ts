import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from '../user/interfaces/user.interface';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { MailService } from 'src/shared/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.signIn({ email, password });

    if (user) {
      delete user.password;

      return user;
    }

    return null;
  }

  async login(user: UserInterface) {
    return {
      user_id: user.id,
      access_token: this.jwtService.sign({
        firstName: user.firstName,
        isAdmin: user.isAdmin,
        email: user.email,
        sub: user.id,
      }),
    };
  }

  async forgotPassword({ email }: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    const token = await this.login(user);

    await this.mailService.sendForgotPassword(user, token.access_token);
  }
}
