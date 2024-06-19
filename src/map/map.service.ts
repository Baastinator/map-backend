import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql/mysql.service';
import { MapModel } from './models/map.model';
import { MapCreateDto } from './models/map-create.dto';
import { SignalService } from '../gateways/socket/signal.service';
import { Signals } from '../gateways/socket/signals.enum';

@Injectable()
export class MapService {
  constructor(
    private mysqlService: MysqlService,
    private signalService: SignalService,
  ) {}

  public async getAll(): Promise<MapModel[]> {
    return await this.mysqlService.query('SELECT * FROM Maps');
  }

  public async getById(id: number): Promise<MapModel> {
    return (
      await this.mysqlService.query('SELECT * FROM Maps WHERE ID = ?', [id])
    )[0];
  }

  public async getMapOwnersById(id: number): Promise<number[]> {
    return await this.mysqlService.query(
      `SELECT U.ID
       FROM Users U
                JOIN Map.UserMapLink UML on U.ID = UML.UserID
                JOIN Map.Maps M on M.ID = UML.MapID
       WHERE MapID = ?
         AND UML.Admin = 1
      `,
      [id],
    );
  }

  public async create(body: MapCreateDto, userID: number): Promise<void> {
    await this.mysqlService.query<void>(
      'INSERT INTO Maps (Name, ImageURL) VALUES (?, ?)',
      [body.name, body.url],
    );

    await this.mysqlService.query(
      'INSERT INTO Logs (UserID, EventID) VALUES (?, ?)',
      [userID, 1],
    );

    this.signalService.sendSignal(Signals.Maps);

    return;
  }

  public async setImageUrl(id: number, url: string): Promise<void> {
    await this.mysqlService.query<void>(
      'UPDATE Maps SET ImageURL = ? WHERE ID = ?',
      [url, id],
    );

    this.signalService.sendSignal(Signals.Maps);

    return;
  }
}
