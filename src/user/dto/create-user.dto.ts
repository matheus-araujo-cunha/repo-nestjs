import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Matches, IsOptional } from 'class-validator';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { RegExHelper } from 'src/helpers/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Matheus',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'myemail@mail.com',
  })
  email: string;

  @IsNotEmpty()
  @Matches(RegExHelper.password, { message: MessagesHelper.PASSWORD_VALID })
  @ApiProperty({
    example: '1234',
    description: MessagesHelper.PASSWORD_VALID,
  })
  password: string;

  @IsOptional()
  @ApiProperty({
    example: false,
    default: false,
  })
  isAdmin?: boolean;
}
