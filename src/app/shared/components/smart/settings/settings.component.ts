import { Component, inject, OnInit } from '@angular/core';
import { UserDataApiService } from '../../../services/user-data-api.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);
  private userDataApiService = inject(UserDataApiService);
  userData = this.userDataApiService.userData;

  settingsProfileForm: FormGroup;

  successMessage = false;

  constructor() {
    this.settingsProfileForm = this.fb.group(
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

  ngOnInit(): void {
    const data = this.userData();
    if (data) {
      this.settingsProfileForm.patchValue({
        name: data.name,
        login: data.login,
      });
    }
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

  putData() {
    if (this.settingsProfileForm.invalid) {
      this.settingsProfileForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.settingsProfileForm.get('name')?.value);
    formData.append('Login', this.settingsProfileForm.get('login')?.value);
    formData.append('Password', this.settingsProfileForm.get('password')?.value);

    this.settingsService.putData(formData);

    this.successMessage = true;

    this.settingsProfileForm.get('password')?.reset();
    this.settingsProfileForm.get('confirmPassword')?.reset();

    setTimeout(() => (this.successMessage = false), 3000);
  }
}
