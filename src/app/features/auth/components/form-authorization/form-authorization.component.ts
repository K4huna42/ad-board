import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-authorization',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-authorization.component.html',
  styleUrl: './form-authorization.component.scss',
})
export class FormAuthorizationComponent {
  userProfileForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.userProfileForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.credentialsValidator()]],
      login: ['', [Validators.required, this.credentialsValidator()]],
    });
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

  authorizationCall() {
    this.authService.authorization(this.userProfileForm.value);
  }
}
