import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private visibleSignal = signal<boolean>(false);

  visibleState = this.visibleSignal.asReadonly();

  changeVisible(visible: boolean) {
    this.visibleSignal.set(visible);
  }
}
