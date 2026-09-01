import { NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthMiddleware implements NestMiddleware {
    private configService;
    constructor(configService: ConfigService);
    use(req: Request, res: Response, next: () => void): void;
}
