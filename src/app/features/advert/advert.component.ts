import { Component, Input } from '@angular/core';
import { ShortAdvert } from '../advert-list/domains';
import { RussianDatePipe } from '../../shared/pipes/russian-date.pipe';
import { ImageComponent } from '../../shared/components/smart/image/image.component';

@Component({
  selector: 'app-advert',
  imports: [RussianDatePipe, ImageComponent],
  templateUrl: './advert.component.html',
  styleUrl: './advert.component.scss'
})
export class AdvertComponent {

  @Input() data!: ShortAdvert

}
