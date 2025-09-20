import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent: () => import('./features/advert-list/advert-list.component').then(m => m.AdvertListComponent)
    },
    {
        path:'advert-view/:id',
        loadComponent: () => import('./features/advert-view/advert-view.component').then(m => m.AdvertViewComponent)
    }
];
