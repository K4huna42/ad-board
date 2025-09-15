import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AuthStateService } from '../../../../core/auth/services/auth.state.service';
import { AuthApiService } from '../../../../infrastructure/authorization/auth.api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-authorization',
  imports: [ReactiveFormsModule],
  templateUrl: './form-authorization.component.html',
  styleUrl: './form-authorization.component.scss'
})
export class FormAuthorizationComponent implements OnInit {

  userProfileForm: FormGroup;

  constructor(private authApiService: AuthApiService,
    private fb: FormBuilder,
    private authStateService: AuthStateService,
    private authService: AuthService,
    private router: Router) {
    this.userProfileForm = this.fb.group({
      password: ['', Validators.required],
      login: ['', Validators.required]
    })
  }
  ngOnInit(): void {
  }

  authorization() {
    this.authApiService.signIn(this.userProfileForm.value).subscribe(
      (value) => {
        this.authStateService.changeVisible(true);
        this.authService.changeVisible(false);
        localStorage.setItem('VXNlcklk', value);
      },
      (error) => {
        console.log(error.error.message);
      }
    )
  }
}
