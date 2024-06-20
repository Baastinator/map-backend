import { Injectable } from '@nestjs/common';
import { TokenPayload } from './models/token-payload.interface';
import * as jwt from 'jsonwebtoken';
import { UserModel } from '../user/models/user.model';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class TokenService {
  constructor(private configService: ConfigService) {}

  public generateToken(user: UserModel): string {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userID: user.ID,
      admin: user.Admin === 1,
      username: user.Username,
    };

    return jwt.sign(payload, this.configService.get('SECRET'), {
      expiresIn: '24h',
    });
  }

  public verifyToken(token: string): boolean {
    try {
      jwt.verify(token, this.configService.get('SECRET'));
      return true;
    } catch (err) {
      return false;
    }
  }

  public extractPayload(token: string): TokenPayload {
    return jwt.verify(token, this.configService.get('SECRET')) as TokenPayload;
  }

  public extractUserFromRequest(
    req: Request,
  ): Omit<UserModel, 'Passhash'> | null {
    const authHeader = req.headers.authorization;

    if (!authHeader) return null;

    const payload = this.extractPayload(authHeader.split(' ')[1].trim());

    if (!payload) return null;

    return {
      ID: payload.userID,
      Username: payload.username,
      Admin: payload.admin ? 1 : 0,
    };
  }
}
