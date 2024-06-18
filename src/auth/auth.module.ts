import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MysqlModule } from '../mysql/mysql.module';

@Module({
  providers: [AuthService],
  imports: [MysqlModule],
  controllers: [AuthController],
})
export class AuthModule {}
