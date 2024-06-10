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
      await this.mysqlService.query('SELECT * FROM Maps WHERE ID = ?', [
        String(id),
      ])
    )[0];
  }

  public async create(body: MapCreateDto): Promise<void> {
    await this.mysqlService.query<void>(
      'INSERT INTO Maps (Name, ImageURL) VALUES (?, ?)',
      [body.name, body.url],
    );

    this.signalService.sendSignal(Signals.Maps);

    return;
  }

  public async setImageUrl(id: number, url: string): Promise<void> {
    await this.mysqlService.query<void>(
      'UPDATE Maps SET ImageURL = ? WHERE ID = ?',
      [url, String(id)],
    );

    this.signalService.sendSignal(Signals.Maps);

    return;
  }
}
