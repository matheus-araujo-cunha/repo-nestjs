import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QueryFailedError } from 'typeorm';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { CreateMovieDto } from './dto/create-movie.dto.ts';
import { MovieService } from './movie.service';

@UseGuards(AuthGuard('jwt'))
@Controller('movies')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Post()
  async createMovie(@Body() movieRequest: CreateMovieDto) {
    return await this.movieService.save(movieRequest);
  }

  @Get()
  async getAllMovies(@Query('page') page = 1, @Req() req: AuthRequest) {
    return await this.movieService.getAll(req, page);
  }

  @Get(':id')
  async getMovieById(@Req() req: AuthRequest) {
    return await this.movieService.getById(req.params.id);
  }

  @Patch(':id')
  async updateMovie(@Req() req: AuthRequest) {
    return await this.movieService.update(req);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteMovie(@Req() req: AuthRequest) {
    return await this.movieService.delete(req);
  }

  @Post(':id')
  async favoriteMovie(@Req() req: AuthRequest) {
    return await this.movieService.favorite(req);
  }

  @Get('favorites')
  async getFavoriteMovies(@Req() req: AuthRequest) {
    return await this.movieService.getMovies(req);
  }
}
