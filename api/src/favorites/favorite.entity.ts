import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number; // id-котика

  @Column({ unique: true })
  imageId: string; // id картинки

  @Column()
  url: string; // картинка
}
