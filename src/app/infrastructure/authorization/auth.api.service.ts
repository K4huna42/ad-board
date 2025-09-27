import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment.development';
import { User } from '../../core/auth/domains/user.interface'

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private readonly http = inject(HttpClient);

    signUp(user: User): Observable<string> {
      return this.http.post<string>(`${environment.baseApiURL}/Auth/Register`, user);
    }

    signIn(user: User): Observable<string> {
      return this.http.post<string>(`${environment.baseApiURL}/Auth/Login`, user);
    }



}
