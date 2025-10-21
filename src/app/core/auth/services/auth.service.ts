import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthApiService } from '../../../infrastructure/authorization/auth.api.service';
import { AuthStateService } from './auth.state.service';
import { UserDataApiService } from '../../../shared/services/user-data-api.service';
import { ToastService } from '../../../shared/components/dump/toast/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApiService = inject(AuthApiService);
  private authStateService = inject(AuthStateService);
  private userDataApiService = inject(UserDataApiService);

  public visiblePopUp = signal(false);
  private toast = inject(ToastService);

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
              this.toast.show(
                'Вы успешно зарегистрировались! Теперь войдите в свой аккаунт.',
                'success'
              ); 
              this.changeVisible(false);
              break;
          }
        }
      },
      () => {
        this.toast.show('Ошибка', 'error')
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
