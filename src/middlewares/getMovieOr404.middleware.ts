import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { MovieEntity } from 'src/app/movie/movie.entity';

import { Repository } from 'typeorm';

@Injectable()
export class GetMovieOr404 implements NestMiddleware {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not exist`);
    }

    return next();
  }
}
