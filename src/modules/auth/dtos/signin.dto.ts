import { ApiProperty } from '@nestjs/swagger';
import { SignInInterface } from 'src/modules/user/interfaces/signin.interface';

export class SignInDto implements SignInInterface {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
