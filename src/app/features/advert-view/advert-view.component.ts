import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvertService } from '../../shared/services/advert.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImageComponent } from '../../shared/components/smart/images/images.component';

@Component({
  selector: 'app-advert-view',
  imports: [CommonModule, ImageComponent],
  templateUrl: './advert-view.component.html',
  styleUrl: './advert-view.component.scss'
})
export class AdvertViewComponent implements OnInit{
  
  advertId:string = ''
  responceAdvertId$!: Observable<any>;

  private activatedRoute = inject(ActivatedRoute);
  private advertService = inject(AdvertService)

  ngOnInit(): void {
    this.responceAdvertId$ = this.advertService.responceAdvertId$;
    this.advertId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.showAdvert();
  }

  showAdvert(){
    this.advertService.getAdvertByid(this.advertId)
  }





  

}


