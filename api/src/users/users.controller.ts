import {
  Body,
  Controller,
  Post,
  Res,
  HttpException,
  HttpStatus,
  Logger,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as crypto from 'crypto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async newUser(
    @Body() body: { login: string; password: string },
    @Res({ passthrough: true }) res,
  ) {
    try {
      console.log('Received login:', body.login);
      console.log('Received password:', body.password);

      if (!body.login || !body.password) {
        throw new Error('Login and password are required.');
      }

      this.logger.log(body.login);

      const user = await this.usersService.create(body.login, body.password);

      const secretSalt = process.env.SECRET_SALT || 'meow';
      const token = crypto
        .createHash('sha256')
        .update(user.id + secretSalt)
        .digest('hex');

      res.header('X-Auth-Token', token);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      //   res.status(HttpStatus.CREATED).json(result.id);
      return { id: user.id, token: token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async loginUser(
    @Body() body: { login: string; password: string },
    @Res({ passthrough: true }) res,
  ) {
    try {
      if (!body.login || !body.password) {
        throw new Error('Login and password are required.');
      }
      const user = await this.usersService.findByLogin(body.login);
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await this.usersService.validatePassword(
        user,
        body.password,
      );
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const secretSalt = process.env.SECRET_SALT || 'meow';
      const token = crypto
        .createHash('sha256')
        .update(user.id + secretSalt)
        .digest('hex');
      res.header('X-Auth-Token', token);
      return { id: user.id, token: token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard())
  @Get('me')
  async getCurrentUser(@Req() req) {
    return {
      id: req.user.id,
      login: req.user.login,
      createdAt: req.user.created_at,
    };
  }
}
