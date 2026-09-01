import { HttpException } from '@nestjs/common';
import { MysqlService } from '../mysql/mysql.service';
import { MapModel } from './models/map.model';
import { MapCreateDto } from './models/map-create.dto';
import { SignalService } from '../gateways/socket/signal.service';
import { LogService } from '../log/log.service';
import { UserModel } from '../user/models/user.model';
export declare class MapService {
    private mysqlService;
    private signalService;
    private logService;
    constructor(mysqlService: MysqlService, signalService: SignalService, logService: LogService);
    getAll(user: Omit<UserModel, 'Passhash'>): Promise<MapModel[]>;
    getById(id: number): Promise<MapModel>;
    getMapOwnersById(id: number): Promise<number[]>;
    create(body: MapCreateDto, userID: number): Promise<void>;
    setImageUrl(id: number, url: string, userId: number): Promise<void>;
    deleteMap(mapId: number, userId: number): Promise<null | HttpException>;
}
