import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { TokenService } from '../auth/token.service';

@Controller('api/images')
export class ImageController {
  constructor(private tokenService: TokenService) {}

  @Get(':url')
  public async getImage(
    @Param() { url }: { url: string },
    @Req() req: Request,
  ): Promise<StreamableFile> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    if (!url) throw new HttpException('Url missing', HttpStatus.BAD_REQUEST);

    const path = join(process.cwd(), 'uploads', url);

    if (!fs.existsSync(path)) throw new HttpException('Not found', 404);

    return new StreamableFile(fs.createReadStream(path));
  }

  @Post('')
  @UseInterceptors(FileInterceptor('image', { dest: './uploads' }))
  public async uploadFile(
    @UploadedFile() image: { filename: string; originalname: string },
    @Req() req: Request,
  ): Promise<{ url: string }> {
    const user = this.tokenService.extractUserFromRequest(req);

    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    const type = '.' + image.originalname.split('.').slice(-1);

    fs.rename(
      join('uploads', image.filename),
      join('uploads', image.filename + type),
      (): void => void 0,
    );

    const imageUrl = image.filename + type;

    return { url: imageUrl };
  }
}
