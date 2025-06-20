import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like/like.entity';
import { UsersModule } from './users/users.module';
import { LikesModule } from './like/like.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { User } from './users/user.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      cache: false,
      autoLoadEntities: true,
      type: 'postgres',
      host: process.env.DB_HOST || 'cat-pinterest-api-pg',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '1',
      database: process.env.DB_DATABASE || 'support_lk_db',
      entities: [User, Like],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    LikesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
