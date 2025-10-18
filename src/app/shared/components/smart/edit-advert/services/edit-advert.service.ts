import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../../../../enviroments/environment.development';
import { ShortAdvertDtoInterface } from '../../../../../infrastructure/adverts/dto';
import { AdvertsApiService } from '../../../../../infrastructure/adverts/services/adverts.api.service';
import { UserDataApiService } from '../../../../services/user-data-api.service';

@Injectable({
  providedIn: 'root'
})
export class EditAdvertService {

  private advertsApiService = inject(AdvertsApiService);
  private userDataApiService = inject(UserDataApiService);

  loadAdvert(id: string): Observable<ShortAdvertDtoInterface> {
    return this.advertsApiService.getAdvertId(id);
  }

  updateAdvert(id: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('VXNlcklk');
    if (!token) throw new Error('Token not found');

    return new Observable(observer => {
      this.advertsApiService.updateAdvert(formData, token, id).subscribe({
        next: (updatedAdvert: any) => {
          console.log('✅ Объявление обновлено:', updatedAdvert);

          // 🔥 Обновляем объявление в userData
          const currentUser = this.userDataApiService.userData();
          if (currentUser) {
            this.userDataApiService.userData.update(u => ({
              ...u!,
              adverts: u?.adverts?.map(a =>
                a.id === updatedAdvert.id ? updatedAdvert : a
              )
            }));
          }

          observer.next(updatedAdvert);
          observer.complete();
        },
        error: (error) => {
          console.error('Ошибка обновления объявления:', error.error.message);
          observer.error(error);
        }
      });
    });
  }
}
