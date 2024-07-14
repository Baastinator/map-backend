import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MysqlModule } from '../mysql/mysql.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { LogModule } from '../log/log.module';

@Module({
  providers: [AuthService, ConfigService, TokenService],
  imports: [MysqlModule, ConfigModule.forRoot(), LogModule],
  controllers: [AuthController],
  exports: [TokenService],
})
export class AuthModule {}
