import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
} from 'typeorm';

@Unique('UQ_UserLike', ['catId', 'userId'])
@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cat_id' })
  catId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
