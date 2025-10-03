import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesApiService {

  private readonly http = inject(HttpClient);

  getAllCategories(): Observable<any> {
    return this.http.get(`${environment.baseApiURL}/Categories`);
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${environment.baseApiURL}/Categories/${id}`);
  }
}
