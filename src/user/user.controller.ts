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
import { LinkDto } from './models/link.dto';

@Controller('api/users')
export class UserController {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  @Get('')
  public async getUsers(@Req() req: Request): Promise<
    (Omit<UserModel, 'Passhash' | 'Admin' | 'AllowMapUpload'> & {
      Admin: boolean;
      AllowMapUpload: boolean;
    })[]
  > {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    return await this.userService.getAll();
  }

  @Post('password/change')
  public async changePassword(
    @Body() body: LoginDTO,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    if (user.Admin !== 1)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    if (!body.password)
      throw new HttpException('Password missing', HttpStatus.BAD_REQUEST);

    if (!body.username)
      throw new HttpException('Username missing', HttpStatus.BAD_REQUEST);

    await this.userService.changePassword(body, user.ID);
  }

  @Get('links/:mapId')
  public async getMapLinks(
    @Param() { mapId }: { mapId: number },
    @Req() req: Request,
  ): Promise<UserLinkModel> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const isMapAdmin = await this.userService.isMapAdmin(mapId, user.ID);

    if (!user.Admin && !isMapAdmin)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    if (!(+mapId > 0))
      throw new HttpException(
        'mapId needs to be a number',
        HttpStatus.BAD_REQUEST,
      );

    return await this.userService.getUserLinks(mapId);
  }

  @Post('links/add')
  public async addMapLink(
    @Body() { mapId, userId }: LinkDto,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const isMapAdmin = await this.userService.isMapAdmin(mapId, user.ID);

    if (!user.Admin && !isMapAdmin)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    const error = this.validation(mapId, userId);

    if (error) throw error;

    await this.userService.setUserLink(mapId, userId, user.ID, true);
  }

  @Post('links/remove')
  public async removeMapLink(
    @Body() { mapId, userId }: LinkDto,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const isMapAdmin = await this.userService.isMapAdmin(mapId, user.ID);

    if (!user.Admin && !isMapAdmin)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    let error = this.validation(mapId, userId);

    if (error) throw error;

    error = await this.userService.setUserLink(mapId, userId, user.ID, false);

    if (error) throw error;
  }

  @Post('links/addAdmin')
  public async addMapLinkAdmin(
    @Body() { mapId, userId }: LinkDto,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const isMapAdmin = await this.userService.isMapAdmin(mapId, user.ID);

    if (!user.Admin && !isMapAdmin)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    const error = this.validation(mapId, userId);

    if (error) throw error;

    await this.userService.setUserLinkAdmin(mapId, userId, user.ID, true);
  }

  @Post('links/removeAdmin')
  public async removeMapLinkAdmin(
    @Body() { mapId, userId }: LinkDto,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const isMapAdmin = await this.userService.isMapAdmin(mapId, user.ID);

    if (!user.Admin && !isMapAdmin)
      throw new HttpException('Not allowed.', HttpStatus.FORBIDDEN);

    const error = this.validation(mapId, userId);

    if (error) throw error;

    await this.userService.setUserLinkAdmin(mapId, userId, user.ID, false);
  }

  private validation(mapId: number, userId: number): void | HttpException {
    if (!mapId)
      return new HttpException('mapId missing', HttpStatus.BAD_REQUEST);

    if (!userId)
      return new HttpException('userId missing', HttpStatus.BAD_REQUEST);

    if (!(+mapId > 0))
      return new HttpException(
        'mapId needs to be a number',
        HttpStatus.BAD_REQUEST,
      );

    if (!(+userId > 0))
      return new HttpException(
        'userId needs to be a number',
        HttpStatus.BAD_REQUEST,
      );
  }
}
