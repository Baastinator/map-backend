import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql/mysql.service';

@Injectable()
export class AuthService {
  constructor(private mysqlService: MysqlService) {}

  public async getAdminStatusByMap(
    userID: number,
    mapID: number,
  ): Promise<boolean> {
    return (
      (
        await this.mysqlService.query<{ Admin: 1 | 0 }[]>(
          `
            SELECT UML.Admin
            FROM Maps M
                     JOIN UserMapLink UML ON MapID = M.ID
                     JOIN Users U ON UserID = U.ID
            WHERE MapID = ?
              AND UserID = ?
            LIMIT 1
        `,
          [String(mapID), String(userID)],
        )
      )[0].Admin === 1
    );
  }
}
