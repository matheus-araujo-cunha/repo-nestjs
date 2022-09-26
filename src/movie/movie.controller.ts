import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from '../auth/interface/auth-request.interface';
import { CreateMovieDto } from './dto/create-movie.dto.ts';
import { MovieQueryDto } from './dto/movie-query-dto';
import { MovieService } from './movie.service';

@ApiTags('movies')
@Controller('api/movies')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Register one movie' })
  async createMovie(@Body() movieRequest: CreateMovieDto) {
    return await this.movieService.save(movieRequest);
  }

  @Get()
  @ApiOperation({ summary: 'List all movies' })
  async getAllMovies(
    @Query('page') page = 1,
    @Query() querys: MovieQueryDto,
    @Req()
    req: AuthRequest,
  ) {
    return await this.movieService.getAll(req, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'List a movie based on id' })
  async getMovieById(@Param('id') id: string) {
    return await this.movieService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie based on id' })
  async updateMovie(@Req() req: AuthRequest, @Param('id') id: string) {
    return await this.movieService.update(req, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie based on id' })
  @HttpCode(204)
  async deleteMovie(@Param('id') id: string) {
    return await this.movieService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  @ApiOperation({ summary: 'Add a movie to your favorites list' })
  async favoriteMovie(@Req() req: AuthRequest, @Param('id') id: string) {
    return await this.movieService.favorite(req, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('favorites')
  @ApiOperation({ summary: 'List your favorite movies' })
  async getFavoriteMovies(@Req() req: AuthRequest) {
    return await this.movieService.getMovies(req);
  }
}
