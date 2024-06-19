import { MapService } from './map.service';
import { mock } from 'jest-mock-extended';
import { MysqlService } from '../mysql/mysql.service';
import { SignalService } from '../gateways/socket/signal.service';

describe('MapService', () => {
  const setup = (): {
    service: MapService;
    mysqlService: MysqlService;
    signalService: SignalService;
  } => {
    const mysqlService = mock<MysqlService>();
    const signalService = mock<SignalService>();

    const service = new MapService(mysqlService, signalService);

    return { service, mysqlService, signalService };
  };

  it('should be defined', () => {
    const { service } = setup();

    expect(service).toBeDefined();
  });
});
