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

  async getAll({ query }: AuthRequest) {
    const queryFormat = Object.keys(query)[0];

    let movies = [];
    const queryFilter = query[queryFormat] as string;

    switch (queryFormat) {
      case 'title':
        movies = await this.movieRepository.find({
          where: { title: queryFilter },
        });
        break;
      case 'genre':
        movies = await this.movieRepository
          .createQueryBuilder('movies')
          .leftJoinAndSelect('movies.genres', 'genres')
          .where(`genres.name = :name`, { name: queryFilter })
          .getMany();

        break;
      case 'average':
        movies = await this.movieRepository
          .createQueryBuilder('movies')
          .orderBy('movies.average_imdb', 'DESC')
          .getMany();
        break;
      case 'year':
        const allMovies_1 = await this.movieRepository.find();

        movies = allMovies_1.filter(({ releaseYear }) => {
          console.log(releaseYear.getFullYear());
          return releaseYear.getFullYear() === Number(queryFilter);
        });
        break;

      case 'start_year':
        const allMovies_2 = await this.movieRepository.find();

        movies = allMovies_2.filter(({ releaseYear }) => {
          const movieYearTs = releaseYear.getTime();
          const startYearTs = new Date(query.start_year as string).getTime();
          const finishYearTs = new Date(query.finish_year as string).getTime();

          return movieYearTs >= startYearTs && movieYearTs <= finishYearTs;
        });
        break;

      default:
        movies = await this.movieRepository.find();
    }

    return movies;
  }

  async save(data: CreateMovieDto) {
    const { genres } = data;

    const genresCreated = await this.createOrGetGenre(genres);

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

    return await this.userRepository.save(findUser);
  }

  async getMovies({ user }: AuthRequest) {
    const findUser = await this.userRepository.findOneBy({ id: user.id });

    return await findUser.favoriteMovies;
  }

  async delete({ params }: AuthRequest) {
    const { id } = params;

    await this.movieRepository.delete(id);
  }

  async update({ body, params }: AuthRequest) {
    const { id } = params;

    const { genres, ...requestMovie } = body;

    if (genres) {
      body.genres = await this.createOrGetGenre(genres);

      const movie = await this.getById(id);

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
