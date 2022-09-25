import {
  Injectable,
  NestMiddleware,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class VerifyUserExists implements NestMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new UnprocessableEntityException(
        'User with this email already exists',
      );
    }

    return next();
  }
}
