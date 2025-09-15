import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormRegistrationComponent } from './components/form-registration/form-registration.component';
import { FormAuthorizationComponent } from './components/form-authorization/form-authorization.component';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule, FormRegistrationComponent, FormAuthorizationComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {

  showRegistration = true;
  visible: boolean = false
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.visiblePopUp$.subscribe((value: boolean) => {
      this.visible = value;
    })
  }

  closePopUp() {
    this.authService.changeVisible(false)
  }

  toggleForm() {
    this.showRegistration = !this.showRegistration;
  }



}
