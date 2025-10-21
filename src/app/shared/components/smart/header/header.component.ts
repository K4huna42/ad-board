import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AuthStateService } from '../../../../core/auth/services/auth.state.service';
import { CommonModule } from '@angular/common';
import { UserDataApiService } from '../../../services/user-data-api.service';
import { Router, RouterModule } from '@angular/router';
import { CategoriesService } from '../../../../features/categories/services/categories.service';
import { AdvertService } from '../../../services/advert.service';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsService } from '../breadcrumbs/services/breadcrumbs.service';
import { ToastService } from '../../dump/toast/services/toast.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private authStateService = inject(AuthStateService);
  private categoriesService = inject(CategoriesService);
  private advertService = inject(AdvertService);
  private userDataApiService = inject(UserDataApiService);
  private breadcrumbsService = inject(BreadcrumbsService);
  private toast = inject(ToastService);
  private router = inject(Router);

  userData = this.userDataApiService.userData;
  searchText = '';

  get stateAuth() {
    return this.authStateService.visibleState();
  }

  ngOnInit(): void {
    this.userDataApiService.loadUserFromSession();

    const item = sessionStorage.getItem('user');
    if (item) {
      this.authStateService.changeVisible(true);
    }
  }

  openCategories() {
    this.categoriesService.toggle();
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

  newAdvertClick() {
    if (this.stateAuth) {
      this.router.navigate(['/new-advert']);
    } else {
      this.toast.show('Зарегистрируйтесь чтобы создать объявление', 'error');
    }
  }

  async onSearch() {
    const selectedCategory = this.categoriesService.selectedCategoryId();

    if (selectedCategory && selectedCategory !== '00000000-0000-0000-0000-000000000000') {
      await this.categoriesService.setBreadcrumbByCategoryId(selectedCategory);
    } else {
      this.breadcrumbsService.clear();
    }

    this.advertService.getAdverts({
      search: this.searchText,
      showNonActive: true,
      category: selectedCategory,
    });
  }
}
