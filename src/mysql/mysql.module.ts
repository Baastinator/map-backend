import { Module } from '@nestjs/common';
import { MysqlService } from './mysql.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [MysqlService, ConfigService],
  exports: [MysqlService],
})
export class MysqlModule {}
