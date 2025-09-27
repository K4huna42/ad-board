import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ImagesApiService {

  private readonly http = inject(HttpClient);

  getImage(guid: string): Observable<Blob> {
    return this.http.get<Blob>(`${environment.baseApiURL}/Images/${guid}`,{
    responseType: 'blob' as 'json'
  });
  }
}
