import { Module } from '@nestjs/common';
import { LikesService } from './like.service';
import { LikesController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  exports: [TypeOrmModule, LikesService],
  providers: [LikesService],
  controllers: [LikesController],
})
export class FavoritesModule {}
