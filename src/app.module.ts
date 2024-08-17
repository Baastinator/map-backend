import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { AuthMiddleware } from './auth/auth-middleware/auth.middleware';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { LogModule } from './log/log.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, MysqlModule, LogModule],
  controllers: [MapController, ImageController, PinController, UserController],
  providers: [
    MapService,
    ConfigService,
    SignalService,
    SignalGateway,
    PinService,
    UserService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(MapController, PinController, UserController, ImageController);
  }
}
