import { Module } from '@nestjs/common';
import { MapController } from './map/map.controller';
import { MapService } from './map/map.service';
import { MysqlService } from './mysql/mysql.service';
import { ImageController } from './image/image.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignalService } from './gateways/socket/signal.service';
import { SignalGateway } from './gateways/socket/signal.gateway';
import { PinService } from './pin/pin.service';
import { PinController } from './pin/pin.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [MapController, ImageController, PinController],
  providers: [
    MapService,
    MysqlService,
    ConfigService,
    SignalService,
    SignalGateway,
    PinService,
  ],
})
export class AppModule {}
