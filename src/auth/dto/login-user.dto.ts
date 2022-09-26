import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'admin@mail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '1234',
  })
  password: string;
}
