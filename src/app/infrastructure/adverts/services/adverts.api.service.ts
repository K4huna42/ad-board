import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdvertSearchRequestDto, ShortAdvertDtoInterface } from '../dto';
import { environment } from '../../../../enviroments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdvertsApiService {
  private readonly http = inject(HttpClient);

  private getAuthCityHeaders(): HttpHeaders {
    const token = '4dc854bcedaf63c8e9c7a0d028b20391daba4413';
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders().set('Authorization', `Token ${token}`);
  }

  private getAuthHeaders(token: string): HttpHeaders {
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllAdverts(filter: AdvertSearchRequestDto): Observable<ShortAdvertDtoInterface[]> {
    return this.http.post<ShortAdvertDtoInterface[]>(
      `${environment.baseApiURL}/Advert/search`,
      filter,
    );
  }

  getAdvertId(id: string): Observable<ShortAdvertDtoInterface> {
    return this.http.get<ShortAdvertDtoInterface>(`${environment.baseApiURL}/Advert/${id}`);
  }

  createAdvert(form: FormData, token: string) {
    return this.http.post(`${environment.baseApiURL}/Advert`, form, {
      headers: this.getAuthHeaders(token),
    });
  }

  searchCity(query: string) {
    return this.http.post(
      `${environment.DadataApiURL}/rs/suggest/address`,
      {
        query: query,
        from_bound: { value: 'city' },
        to_bound: { value: 'city' },
      },
      { headers: this.getAuthCityHeaders() },
    );
  }

  updateAdvert(form: FormData, token: string, id: string) {
    return this.http.put(`${environment.baseApiURL}/Advert/${id}`, form, {
      headers: this.getAuthHeaders(token),
    });
  }

  deleteAdvert(token: string, id: string) {
    return this.http.delete(`${environment.baseApiURL}/Advert/${id}`, {
      headers: this.getAuthHeaders(token),
    });
  }

  createComment(token: string, id: string) {
    return this.http.post(`${environment.baseApiURL}/Advert/${id}/comments`, {
      headers: this.getAuthHeaders(token),
    });
  }

  getAllComments(id: string) {
    return this.http.get(`${environment.baseApiURL}/Advert/${id}/Comments`);
  }
}
