import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './favorites/like.entity';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/like.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { User } from './users/user.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 'support_lk_db',
      entities: [User, Like],
      synchronize: true,
    }),
    UsersModule,
    FavoritesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
