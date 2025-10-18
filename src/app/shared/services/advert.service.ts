import { inject, Injectable, signal } from '@angular/core';
import {
  AdvertSearchRequestToDtoAdapter,
  ShortAdvertFromDTOAdapter,
} from '../../features/advert-list/adapters';
import { AdvertsApiService } from '../../infrastructure/adverts/services/adverts.api.service';
import { ShortAdvert } from '../../features/advert-list/domains/short-advert.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoriesService } from '../../features/categories/services/categories.service';
import { SafeUrl } from '@angular/platform-browser';
import { Observable, of, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdvertService {
  private advertApiService = inject(AdvertsApiService);
  private categoriesService = inject(CategoriesService);

  selectedRootId = signal<string | null>(null);
  selectedSubId = signal<string | null>(null);
  responceAdvert = signal<ShortAdvert[]>([]);
  visibleAdvertPopUp = signal<boolean>(false);
  responceAdvertId = signal<ShortAdvert>({
    id: '',
    name: '',
    cost: 0,
    location: '',
    description: '',
    createdAt: new Date().toISOString(),
    isActive: false,
    imagesIds: [],
    phone: 0,
  });

  categories = this.categoriesService.categories;


  changeVisible(visible: boolean) {
    this.visibleAdvertPopUp.set(visible);
  }

  getAdverts(value: Record<string, unknown>): void {
    const requestAdvert = AdvertSearchRequestToDtoAdapter(value);

    this.advertApiService.getAllAdverts(requestAdvert).subscribe(
      (value) => {
        const mapped = value.map(ShortAdvertFromDTOAdapter);
        this.responceAdvert.set(mapped);
      },
      (error) => {
        console.log(error.error.message);
      },
    );
  }

  getAdvertByid(id: string): void {
    this.advertApiService.getAdvertId(id).subscribe(
      (value) => {
        const adaptedValue = ShortAdvertFromDTOAdapter(value);
        this.responceAdvertId.set(adaptedValue);
      },
      (error) => {
        console.log(error.error.message);
      },
    );
  }

  searchCity(query: string): Observable<string[]> {
    if (!query || query.length < 2) {
      return of([]);
    }
    return this.advertApiService.searchCity(query).pipe(
      map((value: any) =>
        value.suggestions.map((s: { data: { city: string } }) => s.data.city)
      ),
      catchError(() => of([]))
    );
  }

}
