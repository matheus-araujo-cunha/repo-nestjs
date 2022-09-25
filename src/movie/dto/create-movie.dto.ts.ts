import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
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
  title: string;

  @IsNotEmpty()
  @IsString()
  cover: string;

  @IsNotEmpty()
  @Matches(RegExHelper.date, { message: MessagesHelper.DATE_VALID })
  releaseYear: Date;

  @IsNotEmpty()
  @IsNumber()
  average_imdb: number;

  @IsNotEmpty()
  @IsArray()
  genres: GenreMovieDto[];
}
