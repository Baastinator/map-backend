import { MysqlService } from '../mysql/mysql.service';
export declare class LogService {
    private mysqlService;
    constructor(mysqlService: MysqlService);
    log(userId: number, eventId: number): Promise<void>;
}
