import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDataApiService } from '../../../services/user-data-api.service';
import { AdvertComponent } from '../../../../features/advert/advert.component';
import { MyAdvertsService } from './services/my-adverts.service';

@Component({
  selector: 'app-my-adverts',
  imports: [RouterModule, AdvertComponent],
  templateUrl: './my-adverts.component.html',
  styleUrl: './my-adverts.component.scss',
})
export class MyAdvertsComponent implements OnInit {
  private userDataApiService = inject(UserDataApiService);
  private myAdvertService = inject(MyAdvertsService);
  userData = this.userDataApiService.userData;

  constructor() {
    effect(() => {
      console.log('Обновились объявления:', this.userData()?.adverts);
    });
  }

  ngOnInit(): void {
  }

  deleteMyAdvert(id: string) {
    this.myAdvertService.deleteThisAdvert(id)
  }

  confirmDelete(id: string) {
    const confirmed = confirm('Вы точно хотите удалить это объявление?');
    if (confirmed) {
      this.deleteMyAdvert(id);
    }
  }

}
