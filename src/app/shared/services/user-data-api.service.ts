import { HttpClient } from '@angular/common/http';
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

  getUserData(userid: string): Observable<UserData> {
    return this.http.get<UserData>(`${environment.baseApiURL}/Users/${userid}`);
  }

  saveUserData() {
    const data = localStorage.getItem('VXNlcklk')
    if (data) {
      this.getUserData(data).subscribe(
        (value) => {
          sessionStorage.setItem("user", JSON.stringify(value))
          this.userNameSubject.next(value.name);
        },
        (error) => {
          console.log(error.error.message)
        }
      );
    } else {
      console.log('userId нету');
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