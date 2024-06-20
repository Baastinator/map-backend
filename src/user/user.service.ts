import { Injectable } from '@nestjs/common';
import { LoginDTO } from '../auth/models/login.dto';
import { hashSync } from 'bcrypt';
import { MysqlService } from '../mysql/mysql.service';
import { UserModel } from './models/user.model';
import { UserLink, UserLinkModel } from './models/user-link.model';

@Injectable()
export class UserService {
  constructor(private mysqlService: MysqlService) {}

  public async changePassword(body: LoginDTO, userId: number): Promise<void> {
    const saltRounds = 10;
    const hash = hashSync(body.password, saltRounds);

    await this.mysqlService.query(
      `INSERT INTO Logs (EventID, UserID)
       VALUES (11, ?)`,
      [userId],
    );

    await this.mysqlService.query(
      'UPDATE Users SET Passhash = ? WHERE Username = ?',
      [hash, body.username],
    );
  }

  public async getAll(): Promise<
    (Omit<UserModel, 'Passhash' | 'Admin'> & {
      Admin: boolean;
    })[]
  > {
    return (
      await this.mysqlService.query<UserModel[]>('SELECT * FROM Users')
    ).map((user: UserModel) => ({
      ID: user.ID,
      Admin: user.Admin === 1,
      Username: user.Username,
    }));
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
          WHERE M.ID IS NOT NULL
            AND M.ID = ?
            AND U.Admin = FALSE`,
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
}
