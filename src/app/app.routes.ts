import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
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
        data: { breadcrumb: 'Объявление' },
        loadComponent: () =>
          import('./features/advert-view/advert-view.component').then((m) => m.AdvertViewComponent),
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
    path: 'my-adverts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/smart/my-adverts/my-adverts.component').then(
        (m) => m.MyAdvertsComponent,
      ),
  },
];
