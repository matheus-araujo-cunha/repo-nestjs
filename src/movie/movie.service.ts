import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { UserEntity } from '../user/user.entity';
import { CreateMovieDto } from './dto/create-movie.dto.ts';
import { GenreEntity } from './entities/genre.entity';
import { MovieEntity } from './entities/movie.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { Request } from 'express';

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

  async getAll({ query }: AuthRequest, page) {
    const queryFormat = Object.keys(query)[0];

    const queryMovie = this.movieRepository.createQueryBuilder('m');
    queryMovie.leftJoinAndSelect('m.genres', 'g');

    const queryFilter = query[queryFormat] as string;

    switch (queryFormat) {
      case 'title':
        queryMovie.where('m.title = :title', { title: queryFilter });
        break;

      case 'genre':
        queryMovie.where(`g.name = :name`, { name: queryFilter });

        break;

      case 'average':
        queryMovie.orderBy('m.average_imdb', 'DESC');
        break;

      case 'year':
        queryMovie.orderBy('m.release_year', 'DESC');
        break;

      case 'start_year':
        const allMovies = await this.movieRepository.find();

        const filteredMovies = allMovies.filter(({ releaseYear }) => {
          const movieYearTs = releaseYear.getTime();
          const startYearTs = new Date(query.start_year as string).getTime();
          const finishYearTs = new Date(query.finish_year as string).getTime();

          return movieYearTs >= startYearTs && movieYearTs <= finishYearTs;
        });

        const moviesId = filteredMovies.map((movie) => `'${movie.id}'`);

        queryMovie.where(`m.id IN (${moviesId})`);
        queryMovie.orderBy('m.release_year', 'DESC');
        break;

      default:
        queryMovie.getMany();
    }

    return paginate(queryMovie, { page, limit: 10 });
  }

  async save(data: CreateMovieDto) {
    const { genres } = data;

    const movieAlreadyExists = await this.movieRepository.findOneBy({
      title: data.title,
    });

    if (movieAlreadyExists) {
      throw new UnprocessableEntityException(
        'There is already a movie with this title',
      );
    }

    const genresCreated = await this.createOrGetGenre(genres);

    data.genres = genresCreated;
    data.releaseYear = new Date(data.releaseYear);

    const movie = await this.movieRepository.save(data);

    return movie;
  }

  async getById(id: string) {
    const movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not exist`);
    }

    return movie;
  }

  async favorite({ user }: AuthRequest, id: string) {
    const movie = await this.getById(id);

    const findUser = await this.userRepository.findOneBy({ id: user.id });

    const movies = await findUser.favoriteMovies;
    movies.push(movie);

    return await this.userRepository.save(findUser);
  }

  async getMovies({ user }: AuthRequest) {
    const findUser = await this.userRepository.findOneBy({ id: user.id });

    return await findUser.favoriteMovies;
  }

  async delete(id: string) {
    await this.getById(id);

    await this.movieRepository.delete(id);
  }

  async update({ body }: Request, id: string) {
    const { genres, ...requestMovie } = body;

    const movie = await this.getById(id);
    if (genres) {
      body.genres = await this.createOrGetGenre(genres);

      await this.movieRepository
        .createQueryBuilder()
        .relation(MovieEntity, 'genres')
        .of(movie)
        .addAndRemove(body.genres, movie.genres);
    }

    await this.movieRepository.update(id, requestMovie);

    const movieUpdated = await this.getById(id);

    return movieUpdated;
  }

  async createOrGetGenre(genres: GenreEntity[]) {
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
    return genresCreated;
  }
}
