import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment.development';
import { User, UserData } from '../../core/auth/domains/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserDataApiService {

  private readonly http = inject(HttpClient);

  private userNameSubject = new BehaviorSubject<string | null>(null);
  public userName$ = this.userNameSubject.asObservable();

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
    return this.http.get<UserData>(`${environment.baseApiURL}/Users/current`, { headers: this.getAuthHeaders(token) });
  }

  handleGetUserDataRequest(requestFn: (param: string) => Observable<any>, data: string) {
    requestFn(data).subscribe(
      (value) => {
        sessionStorage.setItem("user", JSON.stringify(value))
        this.userNameSubject.next(value.name);
      },
      (error) => {
        console.log(error.error.message)
      });
  }

  saveUserData() {
    const authType = localStorage.getItem('authType');
    const data = localStorage.getItem('VXNlcklk')
    switch (authType) {
      case 'registration':
        if (data) {
          this.handleGetUserDataRequest(this.getUserDataRegistration.bind(this), data)
        }
        else {
          console.log("id нету")
        }
        break;
      case 'auth':
        if (data) {
          this.handleGetUserDataRequest(this.getUserDataAuthorization.bind(this), data)
        }
        else {
          console.log("токена нету")
        }
        break;
      default:
        console.log('Тип авторизации неизвестен');
        break;
    }
  }

  loadUserFromSession() {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      this.userNameSubject.next(parsedUser.name ?? null);
    }
  }
}