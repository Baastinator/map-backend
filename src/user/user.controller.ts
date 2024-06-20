import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { LoginDTO } from '../auth/models/login.dto';
import { Request } from 'express';
import { TokenService } from '../auth/token.service';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';
import { UserLinkModel } from './models/user-link.model';

@Controller('api/users')
export class UserController {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  @Get('')
  public async getUsers(): Promise<
    (Omit<UserModel, 'Passhash' | 'Admin'> & {
      Admin: boolean;
    })[]
  > {
    return await this.userService.getAll();
  }

  @Post('password/change')
  public async changePassword(
    @Body() body: LoginDTO,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('login first', HttpStatus.UNAUTHORIZED);

    if (user.Admin !== 1)
      throw new HttpException('stop, thief', HttpStatus.FORBIDDEN);

    await this.userService.changePassword(body, user.ID);
  }

  @Get('links/:mapId')
  public async getMapLinks(
    @Param() { mapId }: { mapId: number },
  ): Promise<UserLinkModel> {
    return await this.userService.getUserLinks(mapId);
  }
}
