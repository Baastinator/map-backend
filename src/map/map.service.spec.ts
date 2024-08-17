import { MapService } from './map.service';
import { mock } from 'jest-mock-extended';
import { MysqlService } from '../mysql/mysql.service';
import { SignalService } from '../gateways/socket/signal.service';
import { LogService } from '../log/log.service';

describe('MapService', () => {
  const setup = (): {
    service: MapService;
  } => {
    const mysqlService = mock<MysqlService>();
    const signalService = mock<SignalService>();
    const logService = mock<LogService>();

    const service = new MapService(mysqlService, signalService, logService);

    return { service };
  };

  it('should be defined', () => {
    const { service } = setup();

    expect(service).toBeDefined();
  });
});
