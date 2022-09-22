import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateAdminGuard, isAdminGuard } from '../auth/strategies/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(CreateAdminGuard)
  @Post()
  async save(@Body() userRequest: CreateUserDto) {
    return await this.userService.save(userRequest);
  }
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(isAdminGuard)
  @Get()
  async listAll() {
    return await this.userService.listAll();
  }

  @Post('login')
  async login(@Body() loginRequest: LoginUserDto) {
    return await this.userService.login(loginRequest);
  }
}
