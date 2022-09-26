import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAdminGuard, isAdminGuard } from '../auth/strategies/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('api/users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(CreateAdminGuard)
  @Post()
  @ApiOperation({ summary: 'Register a user' })
  async save(@Body() userRequest: CreateUserDto) {
    return await this.userService.save(userRequest);
  }
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(isAdminGuard)
  @Get()
  @ApiOperation({ summary: 'List all users' })
  async listAll() {
    return await this.userService.listAll();
  }
}
