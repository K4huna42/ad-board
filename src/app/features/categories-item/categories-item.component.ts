import { Component, inject, Input } from '@angular/core';
import { Category } from '../categories/domains/category.interface';
import { CategoriesService } from '../categories/services/categories.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories-item',
  imports: [CommonModule, CategoriesItemComponent],
  templateUrl: './categories-item.component.html',
  styleUrl: './categories-item.component.scss',
})
export class CategoriesItemComponent {
  private categoriesService = inject(CategoriesService);

  @Input() cat!: Category;

  get selectedCategoryId() {
    return this.categoriesService.selectedCategoryId();
  }

  isSelected(id: string) {
    return this.selectedCategoryId === id;
  }

  onCategoryClick(cat: Category) {
    const isAlreadySelected = this.selectedCategoryId === cat.id;
    this.categoriesService.selectedCategoryId.set(isAlreadySelected ? null : cat.id);
    if (!isAlreadySelected) {
      this.categoriesService.tumblerCategory(cat);
    }
  }
}
