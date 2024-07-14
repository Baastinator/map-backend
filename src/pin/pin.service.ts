import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql/mysql.service';
import { PinDto, toPinDto } from './models/pin.dto';
import { PinModel } from './models/pin.model';
import { PinCreateDto } from './models/pin-create.dto';
import { SignalService } from '../gateways/socket/signal.service';
import { Signals } from '../gateways/socket/signals.enum';
import { LogService } from '../log/log.service';

@Injectable()
export class PinService {
  constructor(
    private mysqlService: MysqlService,
    private signalService: SignalService,
    private logService: LogService,
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
        [id],
      )
    ).map(toPinDto)[0];
  }

  public async getByMapId(mapId: number): Promise<PinDto[]> {
    return (
      await this.mysqlService.query<PinModel[]>(
        'SELECT * FROM Pins WHERE MapID = ?',
        [mapId],
      )
    ).map(toPinDto);
  }

  public async createNew(body: PinCreateDto, userId: number): Promise<void> {
    await this.mysqlService.query<void>(
      'INSERT INTO Pins (Name, X, Y, Content, MapID) VALUES (?, ?, ?, ?, ?)',
      [body.name, String(body.x), String(body.y), body.content, body.mapId],
    );

    await this.logService.log(userId, 2);

    this.signalService.sendSignal(Signals.Pins);
  }

  public async deleteById(id: number, userId: number): Promise<void> {
    await this.mysqlService.query<void>('DELETE FROM Pins WHERE ID = ?', [id]);

    await this.logService.log(userId, 13);

    this.signalService.sendSignal(Signals.Pins);
  }

  public async rename(name: string, id: number, userId: number): Promise<void> {
    await this.mysqlService.query<void>(
      'UPDATE Pins SET Name = ? WHERE ID = ?',
      [name, id],
    );

    await this.logService.log(userId, 15);

    this.signalService.sendSignal(Signals.Pins);
  }

  public async reContent(
    content: string,
    id: number,
    userId: number,
  ): Promise<void> {
    await this.mysqlService.query<void>(
      'UPDATE Pins SET Content = ? WHERE ID = ?',
      [content, id],
    );

    await this.logService.log(userId, 16);

    this.signalService.sendSignal(Signals.Pins);
  }

  public async isMapAdmin(pinId: number, userId: number): Promise<boolean> {
    return (
      (
        await this.mysqlService.query<{ Admin: 0 | 1 }[]>(
          `SELECT UML.Admin
           FROM Pins P
                    JOIN Maps M on M.ID = P.MapID
                    JOIN UserMapLink UML on M.ID = UML.MapID
                    JOIN Map.Users U on UML.UserID = U.ID`,
        )
      )[0].Admin === 1
    );
  }
}
