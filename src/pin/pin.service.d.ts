import { MysqlService } from '../mysql/mysql.service';
import { PinDto } from './models/pin.dto';
import { PinCreateDto } from './models/pin-create.dto';
import { SignalService } from '../gateways/socket/signal.service';
import { LogService } from '../log/log.service';
export declare class PinService {
    private mysqlService;
    private signalService;
    private logService;
    constructor(mysqlService: MysqlService, signalService: SignalService, logService: LogService);
    getAll(): Promise<PinDto[]>;
    getById(id: number): Promise<PinDto>;
    getByMapId(mapId: number): Promise<PinDto[]>;
    createNew(body: PinCreateDto, userId: number): Promise<void>;
    deleteById(id: number, userId: number): Promise<void>;
    update(data: PinDto, userId: number): Promise<void>;
    isMapAdmin(pinId: number, userId: number): Promise<boolean>;
}
