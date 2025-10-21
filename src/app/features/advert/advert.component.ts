import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ShortAdvert } from '../advert-list/domains';
import { RussianDatePipe } from '../../shared/pipes/russian-date.pipe';
import { ImageComponent } from '../../shared/components/smart/images/images.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-advert',
  imports: [RussianDatePipe, ImageComponent, CommonModule, RouterModule],
  templateUrl: './advert.component.html',
  styleUrl: './advert.component.scss',
})
export class AdvertComponent {
private router = inject(Router)

  @Input() data!: ShortAdvert;
  @Input() showActions: boolean = false; // по умолчанию кнопки скрыты
  @Input() advertId!: string;
  @Input() from: 'my' | 'list' = 'list';
  @Output() delete = new EventEmitter<string>();

  confirmDelete() {
    this.delete.emit(this.advertId); // emit string
  }

  goToEdit() {
    this.router.navigate(['/my-adverts/edit-advert', this.advertId]);
  }

  onCardClick() {
    if (this.from === 'my') {
      this.router.navigate(['/my-adverts/my-advert-view', this.advertId]);
    } 
    else {
      this.router.navigate(['/advert-view', this.advertId]);
    }
  }
}

// [routerLink]="['/advert-view', item.id]"
// '/my-adverts/my-advert-view'
