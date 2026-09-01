import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { MysqlModule } from '../mysql/mysql.module';

@Module({
  imports: [MysqlModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
