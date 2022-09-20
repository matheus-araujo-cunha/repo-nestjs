import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'genres' })
export class Genre {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'name', unique: true })
  name: string;
}
