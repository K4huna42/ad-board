import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AdvertComponent } from '../advert/advert.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShortAdvert } from './domains';
import { AdvertService } from '../../shared/services/advert.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from '../categories/categories.component';
import { CategoriesService } from '../categories/services/categories.service';

@Component({
  selector: 'app-advert-list',
  standalone: true,
  imports: [CommonModule, AdvertComponent, RouterModule, CategoriesComponent],
  templateUrl: './advert-list.component.html',
  styleUrl: './advert-list.component.scss',
})
export class AdvertListComponent implements OnInit {
  advertForm: FormGroup;
  responceAdvert$!: Observable<ShortAdvert[]>;
  showCategories = false;

  private fb = inject(FormBuilder);
  private advertService = inject(AdvertService);
  private categoriesService = inject(CategoriesService);

  constructor() {
    this.advertForm = this.fb.group({
      search: null,
      showNonActive: true,
      category: null,
    });
  }

  ngOnInit(): void {
    this.responceAdvert$ = this.advertService.responceAdvert$;
    this.advertService.getAdverts(this.advertForm.value);

    this.categoriesService.open$.subscribe(state => {
    this.showCategories = state;
  });
  }
}
