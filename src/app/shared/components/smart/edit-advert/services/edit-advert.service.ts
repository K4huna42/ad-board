import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShortAdvertDtoInterface } from '../../../../../infrastructure/adverts/dto';
import { AdvertsApiService } from '../../../../../infrastructure/adverts/services/adverts.api.service';
import { UserDataApiService } from '../../../../services/user-data-api.service';
import { ShortAdvert } from '../../../../../features/advert-list/domains';

@Injectable({
  providedIn: 'root',
})
export class EditAdvertService {
  private advertsApiService = inject(AdvertsApiService);
  private userDataApiService = inject(UserDataApiService);

  loadAdvert(id: string): Observable<ShortAdvertDtoInterface> {
    return this.advertsApiService.getAdvertId(id);
  }

  updateAdvert(id: string, formData: FormData): Observable<ShortAdvert> {
    const token = localStorage.getItem('VXNlcklk');
    if (!token) throw new Error('Token not found');

    return new Observable<ShortAdvert>((observer) => {
      this.advertsApiService.updateAdvert(formData, token, id).subscribe({
        next: (updatedAdvert: ShortAdvert) => {
          const currentUser = this.userDataApiService.userData();
          if (currentUser) {
            this.userDataApiService.userData.update((u) => ({
              ...u!,
              adverts: u?.adverts?.map((a) => (a.id === updatedAdvert.id ? updatedAdvert : a)),
            }));
          }

          observer.next(updatedAdvert);
          observer.complete();
        },
        error: (error) => {
          console.error('Ошибка обновления объявления:', error.error.message);
          observer.error(error);
        },
      });
    });
  }
}
