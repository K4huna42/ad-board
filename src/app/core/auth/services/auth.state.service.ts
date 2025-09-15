import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  constructor() { }

  private visibleSubject = new BehaviorSubject<boolean>(false);
  visibleState$ = this.visibleSubject.asObservable();

  changeVisible(visible: boolean) {
    this.visibleSubject.next(visible)
  }
}
