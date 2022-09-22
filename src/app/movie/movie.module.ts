import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from './genre.entity';
import { MovieEntity } from './movie.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { UserEntity } from '../user/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, GenreEntity, UserEntity])],
  providers: [MovieService],
  controllers: [MovieController],
})
export class MovieModule {}
