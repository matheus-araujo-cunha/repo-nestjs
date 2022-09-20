import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async save(@Body() userRequest: CreateUserDto) {
    return await this.userService.save(userRequest);
  }

  @Get()
  async listAll() {
    return await this.userService.listAll();
  }

  @Post('login')
  async login(@Body() loginRequest: LoginUserDto) {
    return await this.userService.login(loginRequest);
  }
}
