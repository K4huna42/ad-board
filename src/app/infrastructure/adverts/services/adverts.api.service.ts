import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdvertSearchRequestDto, ShortAdvertDtoInterface } from '../dto';
import { environment } from '../../../../enviroments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdvertsApiService {

  private readonly http = inject(HttpClient);

  getAllAdverts(filter: AdvertSearchRequestDto): Observable<ShortAdvertDtoInterface[]>{
    return this.http.post<ShortAdvertDtoInterface[]>(`${environment.baseApiURL}/Advert/search`, filter);
  }


}
