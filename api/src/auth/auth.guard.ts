import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    const userId = await this.validateToken(token);
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    request.userId = userId;
    return true;
  }

  private extractToken(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateToken(token: string): Promise<string | null> {
    const secretSalt = process.env.SECRET_SALT || 'defaultSecret';

    const users = await this.usersService.findAll();

    for (const user of users) {
      const expectedToken = crypto
        .createHash('sha256')
        .update(user.id + secretSalt)
        .digest('hex');

      if (expectedToken === token) {
        return user.id;
      }
    }

    return null;
  }
}
