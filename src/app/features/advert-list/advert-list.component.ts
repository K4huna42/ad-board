import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { AdvertComponent } from '../advert/advert.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdvertService } from '../../shared/services/advert.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
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

  showCategories = false;

  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private advertService = inject(AdvertService);
  private categoriesService = inject(CategoriesService);

  responceAdvert = this.advertService.responceAdvert;

  constructor() {
    this.advertForm = this.fb.group({
      search: null,
      showNonActive: true,
      category: null,
    });

    effect(() => {
      this.showCategories = this.categoriesService.open();
    });

    effect(() => {
      const selected = this.categoriesService.selectedCategoryId();
      this.advertForm.patchValue({ category: selected });
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      const categoryId = params.get('id');

      if (categoryId) {
        await this.categoriesService.setBreadcrumbByCategoryId(categoryId);

        this.advertForm.patchValue({ category: categoryId });
      } else {
        this.categoriesService['breadcrumbsService'].clear();
        this.advertForm.patchValue({ category: null });
      }

      this.advertService.getAdverts(this.advertForm.value);
    });
  }
}
