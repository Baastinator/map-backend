import { LogService } from './log.service';
import { mock } from 'jest-mock-extended';
import { MysqlService } from '../mysql/mysql.service';

describe('LogService', () => {
  const setup = (): {
    service: LogService;
    mysqlService: MysqlService;
  } => {
    const mysqlService = mock<MysqlService>();

    const service = new LogService(mysqlService);

    return { service, mysqlService };
  };

  it('should be defined', () => {
    const { service } = setup();

    expect(service).toBeDefined();
  });
});
