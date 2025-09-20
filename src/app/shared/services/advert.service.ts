import { Injectable } from '@angular/core';
import { AdvertSearchRequestToDtoAdapter, ShortAdvertFromDTOAdapter } from '../../features/advert-list/adapters';
import { AdvertsApiService } from '../../infrastructure/adverts/services/adverts.api.service';
import { ShortAdvert } from '../../features/advert-list/domains/short-advert.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvertService {

  responceAdvert: ShortAdvert[] = [];
  responceAdvertId!: ShortAdvert;

  private responceAdvertSubject = new BehaviorSubject<ShortAdvert[]>([]);
  private responceAdvertIdSubject = new BehaviorSubject<any>(null);
  responceAdvert$ = this.responceAdvertSubject.asObservable();
  responceAdvertId$ = this.responceAdvertIdSubject.asObservable();

  constructor(private advertApiService: AdvertsApiService) { }

  getAdverts(value: any): void {
    const requestAdvert = AdvertSearchRequestToDtoAdapter(value)

    this.advertApiService.getAllAdverts(requestAdvert).subscribe(
      (value) => {
        const mapped = value.map(ShortAdvertFromDTOAdapter);
        this.responceAdvertSubject.next(mapped); 
      },
      (error) => {
        console.log(error.error.message)
      }
    )
  }

  getAdvertByid(id: string): void{
    this.advertApiService.getAdvertId(id).subscribe(
      (value) => {
        const adaptedValue = ShortAdvertFromDTOAdapter(value)
        this.responceAdvertIdSubject.next(adaptedValue); 
      },
      (error) => {
        console.log(error.error.message)
      }
    )
  }


}
