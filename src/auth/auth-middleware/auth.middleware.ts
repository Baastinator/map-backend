import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    const auth = req.headers.authorization;

    if (!auth) {
      throw new HttpException(
        'No authorization present',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = auth.split(' ')[1].trim();

    try {
      const verify = !!jwt.verify(token, this.configService.get('SECRET'));
      if (verify) next();
    } catch (e: unknown) {
      throw new HttpException('Token Invalid', 401);
    }
  }
}
