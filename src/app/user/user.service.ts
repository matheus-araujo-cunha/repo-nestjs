import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(data: CreateUserDto) {
    data.password = await hash(data.password, 10);

    const user = await this.userRepository.save(data);

    return user;
  }

  async login(data: LoginUserDto) {
    const user = await this.userRepository.findOneBy({
      email: data.email,
    });

    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const password = await user.comparePassword(data.password);

    if (!password) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const token = sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: process.env.EXPIRES_IN },
    );

    return { token };
  }

  async listAll() {
    return await this.userRepository.find();
  }
}
