import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql/mysql.service';

@Injectable()
export class LogService {
  constructor(private mysqlService: MysqlService) {}

  public async log(userId: number, eventId: number): Promise<void> {
    await this.mysqlService.query(
      'INSERT INTO Logs (UserID, EventID) VALUES (?, ?)',
      [userId, eventId],
    );
  }
}
