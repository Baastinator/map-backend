import { SignalGateway } from './signal.gateway';
import { mock } from 'jest-mock-extended';
import { SignalService } from './signal.service';
import { of } from 'rxjs';
import { Signals } from './signals.enum';

describe('SignalGateway', () => {
  const setup = (): {
    gateway: SignalGateway;
  } => {
    const signalService = mock<SignalService>();
    signalService.getSignal.mockReturnValue(of(Signals.Maps));

    const gateway = new SignalGateway(signalService);

    return { gateway };
  };

  it('should be defined', () => {
    const { gateway } = setup();

    expect(gateway).toBeDefined();
  });
});
