import { MysqlService } from './mysql.service';

describe('MysqlService', () => {
  const setup = (): {
    service: MysqlService;
  } => {
    const service = new MysqlService();

    return { service };
  };

  it('should be defined', () => {
    const { service } = setup();

    expect(service).toBeDefined();
  });
});
