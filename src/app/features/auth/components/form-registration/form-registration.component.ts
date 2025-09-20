import { Component, OnInit } from '@angular/core';
import { AuthApiService } from '../../../../infrastructure/authorization/auth.api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthComponent } from '../../auth.component';
import { AuthStateService } from '../../../../core/auth/services/auth.state.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-registration.component.html',
  styleUrl: './form-registration.component.scss',
})
export class FormRegistrationComponent implements OnInit {

  userProfileForm: FormGroup;

  constructor(private authApiService: AuthApiService,
    private fb: FormBuilder,
    private authStateService: AuthStateService,
    private authService: AuthService,
    private router: Router) {
    this.userProfileForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      login: ['', Validators.required]
    })
  }
  ngOnInit(): void {
  }

  registrationCall() {
    this.authService.registration(this.userProfileForm.value)
  }
}