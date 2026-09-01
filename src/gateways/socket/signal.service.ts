import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Signals } from './signals.enum';

@Injectable()
export class SignalService {
  private signal$ = new BehaviorSubject<Signals | null>(null);

  public getSignal(): Observable<Signals> {
    return this.signal$.asObservable();
  }

  public sendSignal(signal: Signals): void {
    this.signal$.next(signal);
  }
}
