import { AuthService } from './auth.service';
import { LoginDTO } from './models/login.dto';
import { Request } from 'express';
import { TokenService } from './token.service';
export declare class AuthController {
    private authService;
    private tokenService;
    constructor(authService: AuthService, tokenService: TokenService);
    login(body: LoginDTO): Promise<string>;
    register(body: LoginDTO, req: Request): Promise<void>;
    verify({ token }: {
        token: string;
    }): Promise<boolean>;
}
