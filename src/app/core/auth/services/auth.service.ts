import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthApiService } from '../../../infrastructure/authorization/auth.api.service';
import { AuthStateService } from './auth.state.service';
import { UserDataApiService } from '../../../shared/services/user-data-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApiService = inject(AuthApiService);
  private authStateService = inject(AuthStateService);
  private userDataApiService = inject(UserDataApiService);

  private visibleSubject = new BehaviorSubject<boolean>(false);
  visiblePopUp$ = this.visibleSubject.asObservable();

  changeVisible(visible: boolean) {
    this.visibleSubject.next(visible);
  }

  handleAuthRequest(request$: Observable<unknown>, type: 'auth' | 'registration') {
    request$.subscribe(
      (value) => {
        if (typeof value === 'string') {
          this.authStateService.changeVisible(true);
          this.changeVisible(false);
          localStorage.setItem('VXNlcklk', value);
          localStorage.setItem('authType', type);
          this.userDataApiService.saveUserData();
        }
      },
      (error) => {
        console.log(error.error.message);
      },
    );
  }

  authorization(value: Record<string, unknown>) {
    this.handleAuthRequest(this.authApiService.signIn(value), 'auth');
  }

  registration(value: Record<string, unknown>) {
    this.handleAuthRequest(this.authApiService.signUp(value), 'registration');
  }
}
