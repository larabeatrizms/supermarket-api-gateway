import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { CreateUserDto } from './dtos/create-user.dto';
import { ShowUserDto } from './dtos/show-user.dto';
import {
  UpdateUserAddressBodyDto,
  UpdateUserAddressParamDto,
} from './dtos/update-user-address.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { UpdateUserDto } from './dtos/update-user-profile.dto';
import { SignInInterface } from './interfaces/signin.interface';

export type User = any;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
  ) {}

  pingUserService() {
    const startTs = Date.now();
    return this.userClient.send<string>({ role: 'user', cmd: 'ping' }, {}).pipe(
      timeout(5000),
      map((message) => ({ message, duration: Date.now() - startTs })),
    );
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const source$ = this.userClient
        .send({ role: 'user', cmd: 'find-by-email' }, { email })
        .pipe(timeout(2000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'User not found.',
      });

      if (!result || result.message) {
        throw new UnauthorizedException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }

  async signIn({
    email,
    password,
  }: SignInInterface): Promise<User | undefined> {
    try {
      const source$ = this.userClient
        .send(
          { role: 'user', cmd: 'sign-in' },
          {
            email,
            password,
          },
        )
        .pipe(timeout(2000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'User not found.',
      });

      if (!result || result.message) {
        throw new UnauthorizedException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }

  async createUser(user: CreateUserDto): Promise<User | undefined> {
    try {
      const source$ = this.userClient
        .send({ role: 'user', cmd: 'create-user' }, user)
        .pipe(timeout(2000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Could not create a user.',
      });

      if (!result || result.status === 'error') {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(error);
    }
  }

  async showUser({ id }: ShowUserDto): Promise<User | undefined> {
    try {
      const source$ = this.userClient
        .send(
          { role: 'user', cmd: 'show-user' },
          {
            id: Number(id),
          },
        )
        .pipe(timeout(2000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Could not find a user.',
      });

      if (!result || result.status === 'error') {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(error);
    }
  }

  async updateUserProfile({
    user_id,
    ...data
  }: UpdateUserDto): Promise<User | undefined> {
    try {
      const source$ = this.userClient
        .send(
          { role: 'user', cmd: 'update-user-profile' },
          { id: user_id, ...data },
        )
        .pipe(timeout(2000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Could not find a user.',
      });

      if (!result || result.status === 'error') {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(error);
    }
  }

  async updateUserPassword(
    user_id: string,
    data: UpdateUserPasswordDto,
  ): Promise<User | undefined> {
    try {
      const source$ = this.userClient
        .send(
          { role: 'user', cmd: 'update-user-password' },
          {
            id: user_id,
            ...data,
          },
        )
        .pipe(timeout(2000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Could not find a user.',
      });

      if (!result || result.status === 'error') {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(error);
    }
  }

  async updateUserAddress(
    { address_id }: UpdateUserAddressParamDto,
    data: UpdateUserAddressBodyDto,
  ): Promise<User | undefined> {
    try {
      const source$ = this.userClient
        .send(
          { role: 'user', cmd: 'update-user-address' },
          {
            id: address_id,
            ...data,
          },
        )
        .pipe(timeout(2000));

      const result = await lastValueFrom(source$, {
        defaultValue: 'Could not find a user.',
      });

      if (!result || result.status === 'error') {
        throw new BadRequestException(result.message);
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(error);
    }
  }
}
