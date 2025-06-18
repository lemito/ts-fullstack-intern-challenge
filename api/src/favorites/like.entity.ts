// import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
} from 'typeorm';

@Entity()
@Unique('UQ_UserLike', ['catId', 'userId'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  catId: string;

  @Column()
  userId: string;

  @Column({ nullable: false })
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
