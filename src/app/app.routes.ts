import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'my-adverts',
    data: { breadcrumb: 'Мои объявления' },
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./shared/components/smart/my-adverts/my-adverts.component').then(
            (m) => m.MyAdvertsComponent,
          ),
      },
      {
        path: 'my-advert-view/:id',
        loadComponent: () =>
          import('./features/advert-view/advert-view.component').then(
            (m) => m.AdvertViewComponent,
          ),
      },
      {
        path: 'edit-advert/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./shared/components/smart/edit-advert/edit-advert.component').then(
            (m) => m.EditAdvertComponent,
          )
      },
    ],
  },
  {
    path: '',
    data: { breadcrumb: 'Главная' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/advert-list/advert-list.component').then((m) => m.AdvertListComponent),
      },
      {
        path: 'advert-view/:id',
        loadComponent: () =>
          import('./features/advert-view/advert-view.component').then((m) => m.AdvertViewComponent),
      },
      {
        path: 'category/:id',
        data: { breadcrumb: 'Категория' },
        loadComponent: () =>
          import('./features/advert-list/advert-list.component').then((m) => m.AdvertListComponent),
      },
    ],
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/smart/settings/settings.component').then(
        (m) => m.SettingsComponent,
      ),
  },
  {
    path: 'new-advert',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/smart/new-advert/new-advert.component').then(
        (m) => m.NewAdvertComponent,
      )
  },

];
