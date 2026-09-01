import { MysqlService } from '../mysql/mysql.service';
import { LoginDTO } from './models/login.dto';
import { TokenService } from './token.service';
import { LogService } from '../log/log.service';
export declare class AuthService {
    private mysqlService;
    private tokenService;
    private logService;
    constructor(mysqlService: MysqlService, tokenService: TokenService, logService: LogService);
    login(body: LoginDTO): Promise<string | null>;
    register(body: LoginDTO): Promise<void>;
    verify(token: string): Promise<boolean>;
    exists(username: string): Promise<boolean>;
    private getUserByUsername;
}
