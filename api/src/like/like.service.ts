import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async getLikes(userId: string): Promise<Like[]> {
    return this.likesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(catId: string, userId: string): Promise<Like> {
    const existingLike = await this.likesRepository.findOne({
      where: { catId, userId },
    });

    if (existingLike) {
      throw new Error('Like already exists');
    }

    const like = this.likesRepository.create({ catId, userId });
    return this.likesRepository.save(like);
  }

  async delete(catId: string, userId: string): Promise<void> {
    await this.likesRepository.delete({ catId, userId });
  }
}
