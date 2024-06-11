import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PinDto } from './models/pin.dto';
import { PinService } from './pin.service';
import { Identifiable } from '../models/id.interface';
import { PinCreateDto } from './models/pin-create.dto';

@Controller('api/pins')
export class PinController {
  constructor(private pinService: PinService) {}

  @Get('')
  public async getAll(): Promise<PinDto[]> {
    return await this.pinService.getAll();
  }

  @Get(':id')
  public async getById(@Param() { id }: Identifiable): Promise<PinDto> {
    return await this.pinService.getById(id);
  }

  @Get('map/:id')
  public async getByMapId(@Param() { id }: Identifiable): Promise<PinDto[]> {
    return await this.pinService.getByMapId(id);
  }

  @Post('')
  public async createNewPin(@Body() body: PinCreateDto): Promise<void> {
    return await this.pinService.createNew(body);
  }

  @Post('rename/:id')
  public async renamePin(
    @Body() { name }: { name: string },
    @Param() { id }: Identifiable,
  ): Promise<void> {
    return await this.pinService.rename(name, id);
  }

  @Post('content/:id')
  public async reContentPin(
    @Body() { content }: { content: string },
    @Param() { id }: Identifiable,
  ): Promise<void> {
    return await this.pinService.reContent(content, id);
  }

  @Delete(':id')
  public async deletePinById(@Param() { id }: Identifiable): Promise<void> {
    return await this.pinService.deleteById(id);
  }
}
