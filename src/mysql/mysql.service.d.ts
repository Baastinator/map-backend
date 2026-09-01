import { ConfigService } from '@nestjs/config';
export declare class MysqlService {
    private configService;
    private logger;
    private dbCon;
    constructor(configService: ConfigService);
    query<T>(query: string, params?: any[]): Promise<T>;
}
