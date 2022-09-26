import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { RegExHelper } from 'src/helpers/regex.helper';

class GenreMovieDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Como treinar o seu dragão',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example:
      'https://livrosfilmes2017.files.wordpress.com/2019/01/como-treinar-seu-drag%C3%A3o-capa.jpg?w=330&h=477',
  })
  cover: string;

  @IsNotEmpty()
  @Matches(RegExHelper.date, { message: MessagesHelper.DATE_VALID })
  @ApiProperty({
    example: '2010/03/23',
  })
  releaseYear: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 8,
  })
  averageImdb: number;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: [{ name: 'Ação' }, { name: 'Animação' }],
  })
  genres: GenreMovieDto[];
}
