import { MapService } from './map.service';
import { mock } from 'jest-mock-extended';
import { MysqlService } from '../mysql/mysql.service';

describe('MapService', () => {
  const setup = (): {
    service: MapService;
    mysqlService: MysqlService;
  } => {
    const mysqlService = mock<MysqlService>();

    const service = new MapService(mysqlService);

    return { service, mysqlService };
  };

  it('should be defined', () => {
    const { service } = setup();

    expect(service).toBeDefined();
  });
});
