import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from '../auth/models/login.dto';
import { hashSync } from 'bcrypt';
import { MysqlService } from '../mysql/mysql.service';
import { UserModel } from './models/user.model';
import { UserLink, UserLinkModel } from './models/user-link.model';
import { LogService } from '../log/log.service';
import { SignalService } from '../gateways/socket/signal.service';
import { Signals } from '../gateways/socket/signals.enum';

@Injectable()
export class UserService {
  constructor(
    private mysqlService: MysqlService,
    private logService: LogService,
    private signalService: SignalService,
  ) {}

  public async changePassword(body: LoginDTO, userId: number): Promise<void> {
    const saltRounds = 10;
    const hash = hashSync(body.password, saltRounds);

    await this.mysqlService.query(
      'UPDATE Users SET Passhash = ? WHERE Username = ?',
      [hash, body.username],
    );

    await this.logService.log(11, userId);
  }

  public async getAll(): Promise<
    (Omit<UserModel, 'Passhash' | 'Admin' | 'AllowMapUpload'> & {
      Admin: boolean;
      AllowMapUpload: boolean;
    })[]
  > {
    return (
      await this.mysqlService.query<UserModel[]>('SELECT * FROM Users')
    ).map((user: UserModel) => ({
      ID: user.ID,
      Admin: user.Admin === 1,
      Username: user.Username,
      AllowMapUpload: user.AllowMapUpload === 1,
    }));
  }

  // public async toggle(
  //   mapId: number,
  //   userId: number,
  //   adderId: number,
  // ): Promise<void> {
  //   console.log('FUCK (add)', userId, mapId);
  //   await this.logService.log(adderId, 8);
  //
  //   await this.mysqlService.query(
  //     'INSERT INTO UserMapLink (UserID, MapID) VALUES (?, ?)',
  //     [userId, mapId],
  //   );
  //
  //   this.signalService.sendSignal(Signals.Maps);
  // }

  public async setUserLink(
    mapId: number,
    userId: number,
    setterId: number,
    add: boolean,
  ): Promise<void | HttpException> {
    if (!add) {
      const isAdmin = await this.isMapAdmin(mapId, userId);

      if (isAdmin)
        return new HttpException(
          'Cannot remove an admin from the map.',
          HttpStatus.CONFLICT,
        );
    }

    await this.logService.log(setterId, add ? 8 : 6);

    await this.mysqlService.query(
      add
        ? 'INSERT INTO UserMapLink (MapID, UserID) VALUES (?, ?)'
        : 'DELETE FROM UserMapLink WHERE MapID = ? AND UserID = ?',
      [mapId, userId],
    );

    this.signalService.sendSignal(Signals.Maps);
  }

  public async setUserLinkAdmin(
    mapId: number,
    userId: number,
    setterId: number,
    enable: boolean,
  ): Promise<void> {
    if (!enable && (await this.isMapOwner(mapId, userId)))
      throw new HttpException(
        "Cannot remove Map Owner's Admin",
        HttpStatus.FORBIDDEN,
      );

    const link = (
      await this.mysqlService.query<{ UserID: 0 | 1 }[]>(
        'SELECT UserID FROM UserMapLink WHERE MapID = ? AND UserID = ?',
        [mapId, userId],
      )
    )[0];

    if (!link) await this.setUserLink(mapId, userId, setterId, true);

    await this.logService.log(setterId, enable ? 9 : 17);

    await this.mysqlService.query(
      'UPDATE UserMapLink SET Admin = ? WHERE UserID = ? AND MapID = ?',
      [enable ? 1 : 0, userId, mapId],
    );

    this.signalService.sendSignal(Signals.Maps);
  }

  public async getUserLinks(mapID: number): Promise<UserLinkModel> {
    const unselected = await this.mysqlService.query<
      Omit<UserModel, 'Passhash' | 'Admin'>[]
    >(
      `SELECT U.ID, Username
       FROM Users U
                LEFT JOIN Map.UserMapLink UML on U.ID = UML.UserID
                LEFT JOIN Map.Maps M on UML.MapID = M.ID
       WHERE U.ID NOT IN
             (SELECT U.ID
              FROM Users U
                       LEFT JOIN Map.UserMapLink UML on U.ID = UML.UserID
                       LEFT JOIN Map.Maps M on UML.MapID = M.ID
              WHERE M.ID IS NOT NULL
                AND M.ID = ?
                AND U.Admin = FALSE)
         AND U.Admin = FALSE
      `,
      [mapID],
    );

    const selected = await this.mysqlService.query<
      Omit<UserModel, 'Passhash'>[]
    >(
      `
          SELECT U.ID, Username, UML.Admin
          FROM Users U
                   LEFT JOIN Map.UserMapLink UML on U.ID = UML.UserID
                   LEFT JOIN Map.Maps M on UML.MapID = M.ID
          WHERE M.ID = ?
            AND U.Admin = FALSE
      `,
      [mapID],
    );

    const userLinks: UserLink[] = [];

    for (const selectedElement of selected) {
      userLinks.push({
        UserID: selectedElement.ID,
        Admin: selectedElement.Admin === 1,
        Username: selectedElement.Username,
        Selected: true,
      });
    }

    for (const selectedElement of unselected) {
      userLinks.push({
        UserID: selectedElement.ID,
        Admin: false,
        Username: selectedElement.Username,
        Selected: false,
      });
    }

    userLinks.sort((a: UserLink, b: UserLink) =>
      a.Username.localeCompare(b.Username),
    );

    return {
      mapID,
      links: userLinks,
    };
  }

  public async isMapAdmin(mapId: number, userId: number): Promise<boolean> {
    return (
      ((
        await this.mysqlService.query<{ Admin: 0 | 1 }[]>(
          'SELECT Admin FROM UserMapLink WHERE UserID = ? AND MapID = ?',
          [userId, mapId],
        )
      )[0]?.Admin ?? 0) === 1
    );
  }

  public async isMapOwner(mapId: number, userId: number): Promise<boolean> {
    return (
      (
        await this.mysqlService.query<{ Creator: number }[]>(
          'SELECT Creator FROM Maps WHERE ID = ?',
          [mapId],
        )
      )[0].Creator == userId
    );
  }
}
