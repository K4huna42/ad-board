import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AuthStateService } from '../../../../core/auth/services/auth.state.service';
import { CommonModule } from '@angular/common';
import { UserDataApiService } from '../../../services/user-data-api.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  stateAuth = false;
  userName$!: Observable<string | null>;

  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);
  private userDataApiService = inject(UserDataApiService);

  ngOnInit(): void {
    this.userDataApiService.loadUserFromSession();
    this.userName$ = this.userDataApiService.userName$;

    this.authStateService.visibleState$.subscribe((value: boolean) => {
      this.stateAuth = value;
    });

    const item = localStorage.getItem('VXNlcklk');
    if (item) {
      this.stateAuth = true;
    }
  }

  openSign() {
    this.authService.changeVisible(true);
  }

  exitClick() {
    const confirmed = confirm('Вы уверены, что хотите выйти?');
    if (confirmed) {
      localStorage.removeItem('VXNlcklk');
      sessionStorage.removeItem('user');
      window.location.href = '/';
    }
  }
}
