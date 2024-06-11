import { Injectable, Logger } from '@nestjs/common';
import { Connection, createConnection, MysqlError } from 'mysql';
import { password } from '../password.txt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MysqlService {
  private logger = new Logger();
  private dbCon: Connection;

  constructor(private configService: ConfigService) {
    this.dbCon = createConnection({
      host: this.configService.get('databaseURI'),
      password,
      user: 'root',
      port: 3306,
      database: 'Map',
    });
    this.dbCon.connect((error: MysqlError) => {
      if (error) {
        this.logger.error(error);
        throw error;
      }
    });
    this.logger.log('Connected to Database');
  }

  public async query<T>(query: string, params?: string[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this.dbCon.query(query, params ?? [], (err, results) => {
        if (err) {
          this.logger.error(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}
