import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-registration.component.html',
  styleUrl: './form-registration.component.scss',
})
export class FormRegistrationComponent {
  userProfileForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.userProfileForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        login: ['', [Validators.required, this.credentialsValidator()]],
        password: ['', [Validators.required, Validators.minLength(8), this.credentialsValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordsMatchValidator(),
      },
    );
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;

      return password === confirmPassword ? null : { passwordsMismatch: true };
    };
  }

  private credentialsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const errors: ValidationErrors = {};

      if (value) {
        const allowedChars = /^[A-Za-z0-9_]*$/;
        const hasSpaces = /\s/;

        if (!allowedChars.test(value)) {
          errors['englishLettersOnly'] = true;
        }

        if (hasSpaces.test(value)) {
          errors['noSpacesAllowed'] = true;
        }
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  registrationCall() {
    const form = {
      name: this.userProfileForm.get('name')?.value,
      login: this.userProfileForm.get('login')?.value,
      password: this.userProfileForm.get('password')?.value,
    };
    this.authService.registration(form);
  }
}
