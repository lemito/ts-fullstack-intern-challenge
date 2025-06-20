import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(login: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { login },
    });
    if (existingUser) {
      throw new Error('User with this login already exists');
    }

    const user = this.usersRepository.create({ login, password });
    return this.usersRepository.save(user);
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { login } });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    // TODO:
    return user.password === password;
  }
}
