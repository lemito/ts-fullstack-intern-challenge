import { Module } from '@nestjs/common';
import { LikesService } from './like.service';
import { LikesController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), UsersModule],
  exports: [TypeOrmModule.forFeature([Like]), LikesService],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
