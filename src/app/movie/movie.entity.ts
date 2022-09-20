import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genre.entity';

@Entity({ name: 'movies' })
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'title', unique: true })
  title: string;

  @Column({ name: 'cover' })
  cover: string;

  @Column({ name: 'release_year' })
  releaseYear: Date;

  @Column({ name: 'average_imdb' })
  average_imdb: number;

  @ManyToMany(() => Genre, { eager: true })
  @JoinTable()
  genres: Genre[];
}
