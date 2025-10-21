import { HttpClient, HttpHeaders } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment.development';
import { User, UserData } from '../../core/auth/domains/user.interface';
import { ToastService } from '../components/dump/toast/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataApiService {
  private readonly http = inject(HttpClient);
  private toast = inject(ToastService)

  readonly userData = signal<User | null>(null);

  constructor() {
    effect(() => {
      const user = this.userData();
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
      }
    });
  }

  private getAuthHeaders(token: string): HttpHeaders {
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserDataRegistration(userid: string): Observable<UserData> {
    return this.http.get<UserData>(`${environment.baseApiURL}/Users/${userid}`);
  }

  getUserDataAuthorization(token: string): Observable<UserData> {
    return this.http.get<UserData>(`${environment.baseApiURL}/Users/current`, {
      headers: this.getAuthHeaders(token),
    });
  }

  putUserData(user: FormData, id: string, token: string): Observable<unknown> {
    return this.http.put(`${environment.baseApiURL}/Users/${id}`, user, {
      headers: this.getAuthHeaders(token),
    });
  }

  handleGetUserDataRequest(requestFn: (param: string) => Observable<unknown>, data: string) {
    requestFn(data).subscribe(
      (value) => {
        if (typeof value === 'object' && value !== null) {
          const user: User = value;
          sessionStorage.setItem('user', JSON.stringify(user));
          this.userData.set(user);
        }
      },
      (error) => {
        this.toast.show('ошибка', 'error')
        console.log(error.error.message);
      },
    );
  }

  saveUserData() {
    const data = localStorage.getItem('VXNlcklk');
    if (data) {
      this.handleGetUserDataRequest(this.getUserDataAuthorization.bind(this), data);
    } else {
      console.log('токена нету');
    }
  }

  loadUserFromSession() {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      this.userData.set(parsedUser);
    }
  }
}
