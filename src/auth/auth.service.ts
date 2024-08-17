import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql/mysql.service';
import { LoginDTO } from './models/login.dto';
import { UserModel } from '../user/models/user.model';
import * as bcrypt from 'bcrypt';
import { hashSync } from 'bcrypt';
import { TokenService } from './token.service';
import { LogService } from '../log/log.service';

@Injectable()
export class AuthService {
  constructor(
    private mysqlService: MysqlService,
    private tokenService: TokenService,
    private logService: LogService,
  ) {}

  public async login(body: LoginDTO): Promise<string | null> {
    const user = await this.getUserByUsername(body.username);

    if (!user) return null;

    const valid = bcrypt.compareSync(body.password, user.Passhash);
    if (!valid) return null;

    await this.logService.log(user.ID, 3);

    return this.tokenService.generateToken(user);
  }

  public async register(body: LoginDTO): Promise<void> {
    const saltRounds = 10;

    const hash = hashSync(body.password, saltRounds);

    await this.logService.log(7, 10);

    return await this.mysqlService.query(
      'INSERT INTO Users (Username, Passhash) VALUES (?, ?)',
      [body.username, hash],
    );
  }

  public async verify(token: string): Promise<boolean> {
    return this.tokenService.verifyToken(token);
  }

  public async exists(username: string): Promise<boolean> {
    return !!(await this.getUserByUsername(username));
  }

  private async getUserByUsername(username: string): Promise<UserModel> {
    const user = await this.mysqlService.query<UserModel[]>(
      'SELECT * FROM Users WHERE Username = ?',
      [username],
    );

    return user[0];
  }
}
