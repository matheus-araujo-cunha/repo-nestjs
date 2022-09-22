import { hashSync } from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { config } from 'dotenv';

config();

export class CreateUserAndMoviesTables1663807449500
  implements MigrationInterface
{
  name = 'CreateUserAndMoviesTables1663807449500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "genres" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_f105f8230a83b86a346427de94d" UNIQUE ("name"), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "cover" character varying NOT NULL, "release_year" TIMESTAMP NOT NULL, "average_imdb" integer NOT NULL, CONSTRAINT "UQ_5aa0bbd146c0082d3fc5a0ad5d8" UNIQUE ("title"), CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "username" character varying NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `
              INSERT INTO "users" ("username", "email", "password", "is_admin")
              VALUES ('${process.env.ADMIN_USERNAME}', '${
        process.env.ADMIN_EMAIL
      }', '${hashSync(process.env.ADMIN_PASSWORD as string, 10)}', true)
          `,
    );
    await queryRunner.query(
      `CREATE TABLE "movies_genres_genres" ("moviesId" uuid NOT NULL, "genresId" integer NOT NULL, CONSTRAINT "PK_59537f354fd4a79606cc4f3cf1b" PRIMARY KEY ("moviesId", "genresId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cb43556a8849221b82cd17461c" ON "movies_genres_genres" ("moviesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ccf6c10277da37e9fc265863fa" ON "movies_genres_genres" ("genresId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_favorite_movies_movies" ("usersId" uuid NOT NULL, "moviesId" uuid NOT NULL, CONSTRAINT "PK_8d3517e11f5a4b13a27606b2a3e" PRIMARY KEY ("usersId", "moviesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_172edafb49388f8e292885a74e" ON "users_favorite_movies_movies" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0c4e60e86dff54aa5bf5a63661" ON "users_favorite_movies_movies" ("moviesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "movies_genres_genres" ADD CONSTRAINT "FK_cb43556a8849221b82cd17461c8" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "movies_genres_genres" ADD CONSTRAINT "FK_ccf6c10277da37e9fc265863fab" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorite_movies_movies" ADD CONSTRAINT "FK_172edafb49388f8e292885a74e2" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorite_movies_movies" ADD CONSTRAINT "FK_0c4e60e86dff54aa5bf5a636611" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_favorite_movies_movies" DROP CONSTRAINT "FK_0c4e60e86dff54aa5bf5a636611"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorite_movies_movies" DROP CONSTRAINT "FK_172edafb49388f8e292885a74e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movies_genres_genres" DROP CONSTRAINT "FK_ccf6c10277da37e9fc265863fab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movies_genres_genres" DROP CONSTRAINT "FK_cb43556a8849221b82cd17461c8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0c4e60e86dff54aa5bf5a63661"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_172edafb49388f8e292885a74e"`,
    );
    await queryRunner.query(`DROP TABLE "users_favorite_movies_movies"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ccf6c10277da37e9fc265863fa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cb43556a8849221b82cd17461c"`,
    );
    await queryRunner.query(`DROP TABLE "movies_genres_genres"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "movies"`);
    await queryRunner.query(`DROP TABLE "genres"`);
  }
}
