import { Module } from '@nestjs/common';
import { MapController } from './map/map.controller';
import { MapService } from './map/map.service';
import { ImageController } from './image/image.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignalService } from './gateways/socket/signal.service';
import { SignalGateway } from './gateways/socket/signal.gateway';
import { PinService } from './pin/pin.service';
import { PinController } from './pin/pin.controller';
import { AuthModule } from './auth/auth.module';
import { MysqlModule } from './mysql/mysql.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, MysqlModule],
  controllers: [MapController, ImageController, PinController],
  providers: [
    MapService,
    ConfigService,
    SignalService,
    SignalGateway,
    PinService,
  ],
})
export class AppModule {}
