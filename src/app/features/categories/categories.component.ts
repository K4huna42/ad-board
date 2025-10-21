import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from './services/categories.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesItemComponent } from '../categories-item/categories-item.component';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule, CategoriesItemComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private categoriesService = inject(CategoriesService);

  categories = this.categoriesService.categories;

  ngOnInit() {
    this.categoriesService.loadAllCategories();
  }
}
