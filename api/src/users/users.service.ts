import { Injectable } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private hashPassword(password: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
  }

  async addUser(dto: UserDTO): Promise<User> {
    const { email, login, password } = dto;
    const existingUser = await this.userRepository.findOne({
      where: { login },
    });
    if (existingUser) {
      throw new Error('Пользователь уже существует');
    }

    const newpassword = this.hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      login,
      password: newpassword,
    });

    return await this.userRepository.save(newUser);
  }
}
