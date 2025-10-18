import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
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

  public visiblePopUp = signal(false);
  public successMessage = signal<string | null>(null);

  changeVisible(visible: boolean) {
    this.visiblePopUp.set(visible);
  }

  handleAuthRequest(request$: Observable<unknown>, type: 'auth' | 'registration') {
    request$.subscribe(
      (value) => {
        if (typeof value === 'string') {
          switch (type) {
            case 'auth':
              this.authStateService.changeVisible(true);
              this.changeVisible(false);
              localStorage.setItem('VXNlcklk', value);
              localStorage.setItem('authType', type);
              this.userDataApiService.saveUserData();
              break;

            case 'registration':
              this.successMessage.set('Вы успешно зарегистрировались! Теперь войдите в свой аккаунт.');
              this.changeVisible(false);

              setTimeout(() => {
              this.successMessage.set(null);
            }, 3000);
              break;
          }
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
