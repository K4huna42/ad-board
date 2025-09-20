import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthApiService } from '../../../infrastructure/authorization/auth.api.service';
import { AuthStateService } from './auth.state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authApiService: AuthApiService,
  private authStateService: AuthStateService) { }

  private visibleSubject = new BehaviorSubject<boolean>(false);
  visiblePopUp$ = this.visibleSubject.asObservable();

  changeVisible(visible:boolean){
    this.visibleSubject.next(visible)
  }

   handleAuthRequest(request$: Observable<any>) {
  request$.subscribe(
    (value) => {
      this.authStateService.changeVisible(true);
      this.changeVisible(false);
      localStorage.setItem('VXNlcklk', value);
    },
    (error) => {
      console.log(error.error.message);
    }
  );
}

authorization(value: any) {
  this.handleAuthRequest(this.authApiService.signIn(value));
}

registration(value: any) {
  this.handleAuthRequest(this.authApiService.signUp(value));
}



}
