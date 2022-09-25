import {
  Injectable,
  NestMiddleware,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { MovieEntity } from 'src/app/movie/movie.entity';

import { Repository } from 'typeorm';

@Injectable()
export class VerifyMovieExists implements NestMiddleware {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const movie = await this.movieRepository.findOneBy({
      title: req.body.title,
    });

    if (movie) {
      throw new UnprocessableEntityException(
        `There is already a movie with this title`,
      );
    }

    return next();
  }
}
