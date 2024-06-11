import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MapModel } from './models/map.model';
import { MapService } from './map.service';
import { MapCreateDto } from './models/map-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Identifiable } from '../models/id.interface';
import { join } from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller('api/maps')
export class MapController {
  constructor(
    private mapService: MapService,
    private configService: ConfigService,
  ) {}

  @Get(['', '/'])
  public async getAll(): Promise<MapModel[]> {
    return await this.mapService.getAll();
  }

  @Get('/:id')
  public async getById(@Param() { id }: Identifiable): Promise<MapModel> {
    return await this.mapService.getById(id);
  }

  @Post('')
  public async create(@Body() body: MapCreateDto): Promise<void> {
    return await this.mapService.create(body);
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

    const imageUrl =
      this.configService.get('backendURL') +
      '/api/images/' +
      image.filename +
      type;

    await this.mapService.setImageUrl(id, imageUrl);

    return { url: imageUrl };
  }
}
