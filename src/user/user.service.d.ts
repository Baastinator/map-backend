import { HttpException } from '@nestjs/common';
import { LoginDTO } from '../auth/models/login.dto';
import { MysqlService } from '../mysql/mysql.service';
import { UserModel } from './models/user.model';
import { UserLinkModel } from './models/user-link.model';
import { LogService } from '../log/log.service';
import { SignalService } from '../gateways/socket/signal.service';
export declare class UserService {
    private mysqlService;
    private logService;
    private signalService;
    constructor(mysqlService: MysqlService, logService: LogService, signalService: SignalService);
    changePassword(body: LoginDTO, userId: number): Promise<void>;
    getAll(): Promise<(Omit<UserModel, 'Passhash' | 'Admin' | 'AllowMapUpload'> & {
        Admin: boolean;
        AllowMapUpload: boolean;
    })[]>;
    setUserLink(mapId: number, userId: number, setterId: number, add: boolean): Promise<void | HttpException>;
    setUserLinkAdmin(mapId: number, userId: number, setterId: number, enable: boolean): Promise<void>;
    getUserLinks(mapID: number): Promise<UserLinkModel>;
    isMapAdmin(mapId: number, userId: number): Promise<boolean>;
    isMapOwner(mapId: number, userId: number): Promise<boolean>;
}
