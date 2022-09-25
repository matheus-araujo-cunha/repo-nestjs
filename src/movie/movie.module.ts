import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from './entities/genre.entity';
import { MovieEntity } from './entities/movie.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, GenreEntity, UserEntity])],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
