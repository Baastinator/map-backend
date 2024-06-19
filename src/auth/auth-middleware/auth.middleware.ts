import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (!req.headers.authorization) {
      throw new HttpException(
        'No authorization present',
        HttpStatus.UNAUTHORIZED,
      );
    }

    next();
  }
}
