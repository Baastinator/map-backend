import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MapService } from './map.service';
import { MapCreateDto } from './models/map-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Identifiable } from '../models/id.interface';
import { join } from 'path';
import * as fs from 'fs';
import { Request } from 'express';
import { TokenService } from '../auth/token.service';
import { MapOwnerModel } from './models/map-owner.model';
import { UserService } from '../user/user.service';

@Controller('api/maps')
export class MapController {
  constructor(
    private mapService: MapService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  @Get(['', '/'])
  public async getAll(@Req() req: Request): Promise<MapOwnerModel[]> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const maps = await this.mapService.getAll();
    const ownerMaps: MapOwnerModel[] = [];

    for (const map of maps) {
      ownerMaps.push({
        ...map,
        owners: await this.mapService.getMapOwnersById(map.ID),
      });
    }

    return ownerMaps;
  }

  @Get('/:id')
  public async getById(
    @Param() { id }: Identifiable,
    @Req() req: Request,
  ): Promise<MapOwnerModel> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    if (!(+id > 0))
      throw new HttpException(
        'mapId needs to be a number',
        HttpStatus.BAD_REQUEST,
      );

    return {
      ...(await this.mapService.getById(id)),
      owners: await this.mapService.getMapOwnersById(id),
    };
  }

  @Post('')
  public async create(
    @Body() body: MapCreateDto,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    if (!body.url)
      throw new HttpException('URL missing', HttpStatus.BAD_REQUEST);

    if (!body.name)
      throw new HttpException('Name missing', HttpStatus.BAD_REQUEST);

    return await this.mapService.create(body, user.ID);
  }

  @Delete('/:id')
  public async delete(
    @Param() { id }: Identifiable,
    @Req() req: Request,
  ): Promise<void> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    if (!(+id > 0))
      throw new HttpException(
        'mapId needs to be a number',
        HttpStatus.BAD_REQUEST,
      );

    const isOwner = await this.userService.isMapOwner(id, user.ID);

    if (!isOwner && !user.Admin)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    const error = await this.mapService.deleteMap(id, user.ID);
    if (error) throw error;
  }

  @Post(':id/mapFile')
  @UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
  public async uploadFile(
    @Param() { id }: Identifiable,
    @UploadedFile() image: { filename: string; originalname: string },
    @Req() req: Request,
  ): Promise<{ url: string }> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const isOwner = await this.userService.isMapOwner(id, user.ID);

    if (!isOwner && !user.Admin)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    if (!(+id > 0))
      throw new HttpException(
        'mapId needs to be a number',
        HttpStatus.BAD_REQUEST,
      );

    const type = '.' + image.originalname.split('.').slice(-1);

    fs.rename(
      join('uploads', image.filename),
      join('uploads', image.filename + type),
      (): void => void 0,
    );

    const imageUrl = image.filename + type;

    await this.mapService.setImageUrl(id, imageUrl, user.ID);

    return { url: imageUrl };
  }
}
