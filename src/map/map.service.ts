import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql/mysql.service';
import { MapModel } from './models/map.model';
import { MapCreateDto } from './models/map-create.dto';
import { SignalService } from '../gateways/socket/signal.service';
import { Signals } from '../gateways/socket/signals.enum';
import { LogService } from '../log/log.service';

@Injectable()
export class MapService {
  constructor(
    private mysqlService: MysqlService,
    private signalService: SignalService,
    private logService: LogService,
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
    return (
      await this.mysqlService.query<{ ID: number }[]>(
        `SELECT U.ID
         FROM Users U
                  JOIN Map.UserMapLink UML on U.ID = UML.UserID
                  JOIN Map.Maps M on M.ID = UML.MapID
         WHERE MapID = ?
           AND UML.Admin = 1
        `,
        [id],
      )
    ).map(({ ID }: { ID: number }) => ID);
  }

  public async create(body: MapCreateDto, userID: number): Promise<void> {
    const { insertId } = await this.mysqlService.query<{ insertId: number }>(
      'INSERT INTO Maps (Name, ImageURL, Creator) VALUES (?, ?, ?)',
      [body.name, body.url, userID],
    );

    console.log(insertId);

    await this.logService.log(userID, 1);

    await this.mysqlService.query(
      'INSERT INTO UserMapLink (UserID, MapID, Admin) VALUES (?, ?, 1)',
      [userID, insertId],
    );

    this.signalService.sendSignal(Signals.Maps);
  }

  public async setImageUrl(
    id: number,
    url: string,
    userId: number,
  ): Promise<void> {
    await this.mysqlService.query<void>(
      'UPDATE Maps SET ImageURL = ? WHERE ID = ?',
      [url, id],
    );

    await this.logService.log(userId, 14);

    this.signalService.sendSignal(Signals.Maps);
  }

  public async deleteMap(
    mapId: number,
    userId: number,
  ): Promise<null | HttpException> {
    const owners = await this.mysqlService.query<{ UserID: number }[]>(
      `
          SELECT UserID
          FROM Users U
                   JOIN Map.UserMapLink UML on U.ID = UML.UserID
                   JOIN Map.Maps M on M.ID = UML.MapID
          WHERE MapID = ?
            AND UML.Admin = 1`,
      [mapId],
    );

    const isOwner = owners
      .map((owner: { UserID: number }) => owner.UserID)
      .includes(userId);

    const isAdmin =
      (
        await this.mysqlService.query<{ Admin: 1 | 0 }[]>(
          'SELECT Admin FROM Users WHERE ID = ?',
          [userId],
        )
      )[0].Admin === 1;

    if (!isAdmin && !isOwner)
      return new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    await this.mysqlService.query<void>(
      'DELETE FROM UserMapLink WHERE MapID = ?',
      [mapId],
    );

    await this.mysqlService.query<void>('DELETE FROM Maps WHERE ID = ?', [
      mapId,
    ]);

    await this.logService.log(userId, 12);

    this.signalService.sendSignal(Signals.Maps);
  }
}
