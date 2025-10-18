import { inject, Injectable } from '@angular/core';
import { AdvertsApiService } from '../../../../../infrastructure/adverts/services/adverts.api.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, of } from 'rxjs';
import { UserDataApiService } from '../../../../services/user-data-api.service';

@Injectable({
  providedIn: 'root'
})
export class NewAdvertService {

  items: unknown;

  private advertsApiService = inject(AdvertsApiService)
  private userDataApiService = inject(UserDataApiService);

  createNewAdvret(form: FormData) {
    const token = localStorage.getItem('VXNlcklk');
    if (token) {
      this.advertsApiService.createAdvert(form, token).subscribe({
        next: (newAdvert: any) => {
          console.log('✅ Объявление создано:', newAdvert);

          // 🔥 Добавляем новое объявление в userData
          const currentUser = this.userDataApiService.userData();
          if (currentUser) {
            this.userDataApiService.userData.update(u => ({
              ...u!,
              adverts: [...(u?.adverts ?? []), newAdvert]
            }));
          }
        },
        error: (error) => {
          console.error('Ошибка создания объявления:', error.error.message);
        }
      });
    }
  }
}
