import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorites/favorite.entity';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'support_lk_db',
      database: 'catsdb',
      entities: [Favorite],
      synchronize: true,
    }),
    UsersModule,
    FavoritesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
