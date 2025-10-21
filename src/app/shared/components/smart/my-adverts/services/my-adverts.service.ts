import { inject, Injectable } from '@angular/core';
import { AdvertsApiService } from '../../../../../infrastructure/adverts/services/adverts.api.service';
import { UserDataApiService } from '../../../../services/user-data-api.service';

@Injectable({
  providedIn: 'root',
})
export class MyAdvertsService {
  private advertsApiService = inject(AdvertsApiService);
  private userDataApiService = inject(UserDataApiService);

  deleteThisAdvert(id: string) {
    const token = localStorage.getItem('VXNlcklk');
    if (!token) return;

    this.advertsApiService.deleteAdvert(token, id).subscribe({
      next: () => {
        const currentUser = this.userDataApiService.userData();
        if (currentUser) {
          this.userDataApiService.userData.update((u) => ({
            ...u!,
            adverts: (u?.adverts ?? []).filter((ad) => ad.id !== id),
          }));
        }
      },
      error: (error) => {
        console.error('Ошибка удаления объявления:', error.error?.message || error);
      },
    });
  }
}
