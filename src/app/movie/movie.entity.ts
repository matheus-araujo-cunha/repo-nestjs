import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GenreEntity } from './genre.entity';

@Entity({ name: 'movies' })
export class MovieEntity {
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

  @ManyToMany(() => GenreEntity, { eager: true })
  @JoinTable()
  genres: GenreEntity[];
}
