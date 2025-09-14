import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdvertComponent } from '../advert/advert.component';
import { AdvertsApiService } from '../../infrastructure/adverts/services/adverts.api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShortAdvertFromDTOAdapter } from './adapters/short-advert.adapter'
import { AdvertSearchRequestToDtoAdapter } from './adapters/advert-search-request.adapter';
import { ShortAdvert } from './domains';

@Component({
  selector: 'app-advert-list',
  imports: [CommonModule, AdvertComponent],
  templateUrl: './advert-list.component.html',
  styleUrl: './advert-list.component.scss'
})
export class AdvertListComponent implements OnInit {

  advertForm: FormGroup;
  responceAdvert: ShortAdvert[] = [];

  constructor(private advertApiService:AdvertsApiService, 
    private fb: FormBuilder,
  ){
    this.advertForm = this.fb.group({
      search: null,
      showNonActive: true,
      category: null
    });
  }

  ngOnInit(): void {
    this.getAdverts()
  }

  getAdverts(): void {
    const requestAdvert = AdvertSearchRequestToDtoAdapter(this.advertForm.value)

    this.advertApiService.getAllAdverts(requestAdvert).subscribe(
      (value) => {
        this.responceAdvert = value.map(ShortAdvertFromDTOAdapter)
        console.log(this.responceAdvert)
      },
      (error) => {
        console.log(error.error.message)
      }
    )
  }

}
