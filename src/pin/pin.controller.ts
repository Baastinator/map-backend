import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { PinDto } from './models/pin.dto';
import { PinService } from './pin.service';
import { Identifiable } from '../models/id.interface';
import { PinCreateDto } from './models/pin-create.dto';
import { Request } from 'express';
import { TokenService } from '../auth/token.service';
import { UserService } from '../user/user.service';

@Controller('api/pins')
export class PinController {
  constructor(
    private pinService: PinService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  @Get('')
  public async getAll(@Req() req: Request): Promise<PinDto[]> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    return await this.pinService.getAll();
  }

  @Get(':id')
  public async getById(
    @Param() { id }: Identifiable,
    @Req() req: Request,
  ): Promise<PinDto> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    if (!(+id > 0))
      throw new HttpException(
        'ID needs to be a number',
        HttpStatus.BAD_REQUEST,
      );

    return await this.pinService.getById(id);
  }

  @Get('map/:id')
  public async getByMapId(
    @Param() { id }: Identifiable,
    @Req() req: Request,
  ): Promise<PinDto[]> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    if (!(+id > 0))
      throw new HttpException(
        'ID needs to be a number',
        HttpStatus.BAD_REQUEST,
      );

    return await this.pinService.getByMapId(id);
  }

  @Post('')
  public async createNewPin(
    @Body() body: PinCreateDto,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const isMapAdmin = await this.userService.isMapAdmin(body.mapId, user.ID);

    if (!isMapAdmin && !user.Admin)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    if (!body.name)
      throw new HttpException('Name missing', HttpStatus.BAD_REQUEST);

    if (!body.mapId)
      throw new HttpException('Map ID missing', HttpStatus.BAD_REQUEST);

    if (!body.content)
      throw new HttpException('Content missing', HttpStatus.BAD_REQUEST);

    if (!body.y)
      throw new HttpException('Y coordinate missing', HttpStatus.BAD_REQUEST);

    if (!body.x)
      throw new HttpException('X coordinate missing', HttpStatus.BAD_REQUEST);

    return await this.pinService.createNew(body, user.ID);
  }

  @Put(':id')
  public async updatePinById(
    @Body() body: Partial<PinCreateDto>,
    @Param() { id }: Identifiable,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const isMapAdmin = await this.pinService.isMapAdmin(id, user.ID);

    if (!isMapAdmin && !user.Admin)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    if (!(+id > 0))
      throw new HttpException(
        'ID needs to be a number',
        HttpStatus.BAD_REQUEST,
      );

    const pin = await this.pinService.getById(id);

    if (body.content) pin.Content = body.content;
    if (body.name) pin.Name = body.name;

    await this.pinService.update(pin, user.ID);
  }

  @Delete(':id')
  public async deletePinById(
    @Param() { id }: Identifiable,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const isMapAdmin = await this.pinService.isMapAdmin(id, user.ID);

    console.log('user.Admin', user.Admin);
    console.log('isMapAdmin', isMapAdmin);

    if (!isMapAdmin && !user.Admin)
      throw new HttpException(
        'Lacking permissions to delete pin.',
        HttpStatus.FORBIDDEN,
      );

    if (!(+id > 0))
      throw new HttpException(
        'ID needs to be a number',
        HttpStatus.BAD_REQUEST,
      );

    return await this.pinService.deleteById(id, user.ID);
  }
}
