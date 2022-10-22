import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/user.service';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendForgotPassword(user: User, token: string) {
    const baseUrl = this.configService.get<string>('APP_URL');
    const url = `${baseUrl}/auth/change-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Reset Password!',
      template: './forgot-password', // `.hbs` extension is appended automatically
      context: {
        name: user.firstName,
        url,
      },
    });
  }
}
