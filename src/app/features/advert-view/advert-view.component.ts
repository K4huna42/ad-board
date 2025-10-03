import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvertService } from '../../shared/services/advert.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImageComponent } from '../../shared/components/smart/images/images.component';
import { ShortAdvert } from '../advert-list/domains';

@Component({
  selector: 'app-advert-view',
  imports: [CommonModule, ImageComponent],
  templateUrl: './advert-view.component.html',
  styleUrl: './advert-view.component.scss',
})
export class AdvertViewComponent implements OnInit {
  advertId = '';
  responceAdvertId$!: Observable<ShortAdvert>;
  visible = false;

  private activatedRoute = inject(ActivatedRoute);
  private advertService = inject(AdvertService);

  ngOnInit(): void {
    this.responceAdvertId$ = this.advertService.responceAdvertId$;
    this.advertId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.advertService.visiblePopUp$.subscribe((value: boolean) => {
      this.visible = value;
    });
    this.showAdvert();
  }

  showAdvert() {
    this.advertService.getAdvertByid(this.advertId);
  }

  closePopUp() {
    this.advertService.changeVisible(false);
  }

  openPopUp() {
    this.advertService.changeVisible(true);
  }
}
