import { inject, Injectable } from '@angular/core';
import { AdvertsApiService } from '../../../../../infrastructure/adverts/services/adverts.api.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, of } from 'rxjs';
import { UserDataApiService } from '../../../../services/user-data-api.service';

@Injectable({
  providedIn: 'root',
})
export class NewAdvertService {
  items: unknown;

  private advertsApiService = inject(AdvertsApiService);
  private userDataApiService = inject(UserDataApiService);

  createNewAdvert(form: FormData): Observable<any> {
    const token = localStorage.getItem('VXNlcklk');

    return new Observable((observer) => {
      if (token) {
        this.advertsApiService.createAdvert(form, token).subscribe({
          next: (newAdvert: any) => {

            // 🔥 Добавляем новое объявление в userData
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
    })

  }
}
