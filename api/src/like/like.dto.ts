import { Like } from './like.entity';

export class LikeDTO {
  catId: string;
  userId: string;
}

export class getAll {
  data: Like[];
}
