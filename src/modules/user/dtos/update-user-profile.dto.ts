import { IUserSession } from 'src/modules/auth/interfaces/user-session.interface';

export interface UpdateUserDto {
  user_id: number;
  isAdmin?: boolean;
  email: string;
  userSession: IUserSession;
}
