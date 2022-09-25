import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    let user: UserEntity;
    try {
      user = await this.userService.findOne({ email });
    } catch (error) {
      return null;
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async login(user: UserEntity) {
    const token = { sub: user.id, email: user.email, isAdmin: user.isAdmin };

    return { token: this.jwtService.sign(token) };
  }
}
