import { inject, Injectable } from '@angular/core';
import { AdvertsApiService } from '../../../../../infrastructure/adverts/services/adverts.api.service';
import { Observable } from 'rxjs/internal/Observable';
import { UserDataApiService } from '../../../../services/user-data-api.service';
import { ShortAdvert } from '../../../../../features/advert-list/domains';

@Injectable({
  providedIn: 'root',
})
export class NewAdvertService {
  items: unknown;

  private advertsApiService = inject(AdvertsApiService);
  private userDataApiService = inject(UserDataApiService);

  createNewAdvert(form: FormData): Observable<ShortAdvert> {
    const token = localStorage.getItem('VXNlcklk');

    return new Observable<ShortAdvert>((observer) => {
      if (token) {
        this.advertsApiService.createAdvert(form, token).subscribe({
          next: (newAdvert: ShortAdvert) => {
            const currentUser = this.userDataApiService.userData();
            if (currentUser) {
              this.userDataApiService.userData.update((u) => ({
                ...u!,
                adverts: [...(u?.adverts ?? []), newAdvert],
              }));
            }

            observer.next(newAdvert);
            observer.complete();
          },
          error: (error) => {
            console.error('Ошибка создания объявления:', error.error.message);
          },
        });
      }
    });
  }
}
