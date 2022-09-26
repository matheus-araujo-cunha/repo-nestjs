import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import { AppDataSource } from 'src/config/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    MovieModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
