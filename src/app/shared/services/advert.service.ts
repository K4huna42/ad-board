import { inject, Injectable } from '@angular/core';
import {
  AdvertSearchRequestToDtoAdapter,
  ShortAdvertFromDTOAdapter,
} from '../../features/advert-list/adapters';
import { AdvertsApiService } from '../../infrastructure/adverts/services/adverts.api.service';
import { ShortAdvert } from '../../features/advert-list/domains/short-advert.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdvertService {
  responceAdvert: ShortAdvert[] = [];
  responceAdvertId!: ShortAdvert;

  private responceAdvertSubject = new BehaviorSubject<ShortAdvert[]>([]);
  responceAdvert$ = this.responceAdvertSubject.asObservable();

  private responceAdvertIdSubject = new BehaviorSubject<unknown>(null);
  responceAdvertId$ = this.responceAdvertIdSubject.asObservable();

  private visibleSubject = new BehaviorSubject<boolean>(false);
  visiblePopUp$ = this.visibleSubject.asObservable();

  private advertApiService = inject(AdvertsApiService);
  changeVisible(visible: boolean) {
    this.visibleSubject.next(visible);
  }

  getAdverts(value: Record<string, unknown>): void {
    const requestAdvert = AdvertSearchRequestToDtoAdapter(value);

    this.advertApiService.getAllAdverts(requestAdvert).subscribe(
      (value) => {
        const mapped = value.map(ShortAdvertFromDTOAdapter);
        this.responceAdvertSubject.next(mapped);
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
        this.responceAdvertIdSubject.next(adaptedValue);
      },
      (error) => {
        console.log(error.error.message);
      },
    );
  }
}
