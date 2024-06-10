import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql/mysql.service';
import { PinDto, toPinDto } from './models/pin.dto';
import { PinModel } from './models/pin.model';
import { PinCreateDto } from './models/pin-create.dto';
import { SignalService } from '../gateways/socket/signal.service';
import { Signals } from '../gateways/socket/signals.enum';

@Injectable()
export class PinService {
  constructor(
    private mysqlService: MysqlService,
    private signalService: SignalService,
  ) {}

  public async getAll(): Promise<PinDto[]> {
    return (
      await this.mysqlService.query<PinModel[]>('SELECT * FROM Pins')
    ).map(toPinDto);
  }

  public async getById(id: number): Promise<PinDto> {
    return (
      await this.mysqlService.query<PinModel[]>(
        'SELECT * FROM Pins WHERE ID = ?',
        [String(id)],
      )
    ).map(toPinDto)[0];
  }

  public async getByMapId(mapId: number): Promise<PinDto[]> {
    return (
      await this.mysqlService.query<PinModel[]>(
        'SELECT * FROM Pins WHERE MapID = ?',
        [String(mapId)],
      )
    ).map(toPinDto);
  }

  public async createNew(body: PinCreateDto): Promise<void> {
    await this.mysqlService.query<void>(
      'INSERT INTO Pins (X, Y, Content, MapID) VALUES (?, ?, ?, ?)',
      [String(body.x), String(body.y), body.content, String(body.mapId)],
    );

    this.signalService.sendSignal(Signals.Pins);
  }
}
