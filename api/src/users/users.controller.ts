import {
  Body,
  Controller,
  Post,
  Res,
  Header,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as crypto from 'crypto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Header('X-Auth-Token', '')
  async newUser(@Body() body: { login: string; password: string }, @Res() res) {
    try {
      const user = await this.usersService.create(body.login, body.password);

      const secretSalt = process.env.SECRET_SALT || 'meow';
      const token = crypto
        .createHash('sha256')
        .update(user.id + secretSalt)
        .digest('hex');

      res.header('X-Auth-Token', token);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
