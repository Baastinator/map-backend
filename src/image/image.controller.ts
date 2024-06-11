import {
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@Controller('api/images')
export class ImageController {
  constructor(private configService: ConfigService) {}

  @Get(':url')
  public async getImage(
    @Param() { url }: { url: string },
  ): Promise<StreamableFile> {
    const path = join(process.cwd(), 'uploads', url);

    if (!fs.existsSync(path)) throw new HttpException('Not found', 404);

    return new StreamableFile(fs.createReadStream(path));
  }

  @Post('')
  @UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
  public async uploadFile(
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

    return { url: imageUrl };
  }
}
