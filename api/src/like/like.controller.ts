import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './like.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('likes')
@UseGuards(AuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  async listLikes(@Req() req) {
    const userId = req.userId;
    const likes = await this.likesService.getLikes(userId);
    return { data: likes };
  }

  @Post()
  async newLike(@Body() body: { cat_id: string }, @Req() req) {
    const userId = req.userId;
    const like = await this.likesService.create(body.cat_id, userId);
    return { id: like.id, cat_id: like.catId };
  }

  @Delete(':cat_id')
  async dropLike(@Param('cat_id') catId: string, @Req() req) {
    const userId = req.userId;
    await this.likesService.delete(catId, userId);
    return { message: 'Like successfully deleted' };
  }
}
