import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './app/movie/movie.module';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      logging: false,
      ssl: { rejectUnauthorized: false },
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: true,
    }),
    UserModule,
    MovieModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
