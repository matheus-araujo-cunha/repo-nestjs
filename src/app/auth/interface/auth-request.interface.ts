import { Request } from 'express';
import { UserEntity } from 'src/app/user/user.entity';

export interface AuthRequest extends Request {
  user: UserEntity;
}
