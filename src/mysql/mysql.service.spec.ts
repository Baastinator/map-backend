import { MysqlService } from './mysql.service';
import { ConfigService } from '@nestjs/config';
import { mock } from 'jest-mock-extended';

describe('MysqlService', () => {
  const setup = (): {
    service: MysqlService;
  } => {
    const configService = mock<ConfigService>();

    const service = new MysqlService(configService);

    return { service };
  };

  it('should be defined', () => {
    const { service } = setup();

    expect(service).toBeDefined();
  });
});
