import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MovieEntity } from '../movie/entities/movie.entity';
import { compare } from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @ManyToMany(() => MovieEntity, { lazy: true })
  @JoinTable()
  favoriteMovies: MovieEntity[];

  comparePassword = async (passwordToCompare: string): Promise<boolean> => {
    return await compare(passwordToCompare, this.password);
  };
}
