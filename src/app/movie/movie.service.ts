import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { UserEntity } from '../user/user.entity';
import { CreateMovieDto } from './dto/create-movie.dto.ts';
import { GenreEntity } from './genre.entity';
import { MovieEntity } from './movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(GenreEntity)
    private genreRepository: Repository<GenreEntity>,
  ) {}

  async save(data: CreateMovieDto) {
    const { genres } = data;

    const genresCreated = [];

    for (const genre of genres) {
      const genreExists = await this.genreRepository.findOneBy({
        name: genre.name,
      });

      if (genreExists) {
        genresCreated.push(genreExists);
        continue;
      }

      const genreCreated = await this.genreRepository.save(genre);

      genresCreated.push(genreCreated);
    }

    data.genres = genresCreated;
    data.releaseYear = new Date(data.releaseYear);

    const movie = await this.movieRepository.save(data);

    return movie;
  }

  async getById(id: string) {
    const movie = await this.movieRepository.findOneBy({ id });

    return movie;
  }

  async favorite({ params, user }: AuthRequest) {
    const { id } = params;

    const movie = await this.getById(id);

    const findUser = await this.userRepository.findOneBy({ id: user.id });

    const movies = await findUser.favoriteMovies;
    movies.push(movie);

    console.log(movies);

    return await this.userRepository.save(findUser);
  }

  async getMovies({ user }: AuthRequest) {
    const findUser = await this.userRepository.findOneBy({ id: user.id });

    return await findUser.favoriteMovies;
  }
}
