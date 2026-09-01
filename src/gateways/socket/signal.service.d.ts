import { Observable } from 'rxjs';
import { Signals } from './signals.enum';
export declare class SignalService {
    private signal$;
    getSignal(): Observable<Signals>;
    sendSignal(signal: Signals): void;
}
