import {
  Body,
  Controller,
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

@Controller('api/maps')
export class MapController {
  constructor(
    private mapService: MapService,
    private tokenService: TokenService,
  ) {}

  @Get(['', '/'])
  public async getAll(): Promise<MapOwnerModel[]> {
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
  public async getById(@Param() { id }: Identifiable): Promise<MapOwnerModel> {
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

    if (!user) throw new HttpException('login first', HttpStatus.UNAUTHORIZED);
    if (user.Admin !== 1) throw new HttpException('No', HttpStatus.FORBIDDEN);

    return await this.mapService.create(body, user.ID);
  }

  @Post(':id/mapFile')
  @UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
  public async uploadFile(
    @Param() { id }: Identifiable,
    @UploadedFile() image: { filename: string; originalname: string },
  ): Promise<{ url: string }> {
    const type = '.' + image.originalname.split('.').slice(-1);

    fs.rename(
      join('uploads', image.filename),
      join('uploads', image.filename + type),
      (): void => void 0,
    );

    const imageUrl = image.filename + type;

    await this.mapService.setImageUrl(id, imageUrl);

    return { url: imageUrl };
  }

  @Get(':id/owners')
  public async getOwnersById(@Param() { id }: Identifiable): Promise<number[]> {
    return;
  }
}
