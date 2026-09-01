import { TokenPayload } from './models/token-payload.interface';
import { UserModel } from '../user/models/user.model';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
export declare class TokenService {
    private configService;
    constructor(configService: ConfigService);
    generateToken(user: UserModel): string;
    verifyToken(token: string): boolean;
    extractPayload(token: string): TokenPayload;
    extractUserFromRequest(req: Request): Omit<UserModel, 'Passhash'> | null;
}
