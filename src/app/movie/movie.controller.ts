import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  @Patch(':id')
  async updateMovie() {
    return null;
  }

  @Delete(':id')
  async deleteMovie() {
    return null;
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
