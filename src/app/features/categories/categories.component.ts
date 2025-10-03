import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService, Category } from './services/categories.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];
  selectedCategories: Set<string> = new Set();
  selectedCategoryId: string | null = null;

  private categoriesService = inject(CategoriesService);

  ngOnInit() {
    this.categoriesService.getRootCategories().subscribe(data => {
      this.categories = data
        .filter(cat => cat.parentId === '00000000-0000-0000-0000-000000000000')
        .map(cat => ({
          ...cat,
          expanded: false,
          childs: [],
          hasChildren: data.some(c => c.parentId === cat.id)
        })
      );
    });
  }

  toggleCategory(category: Category): void {
    category.expanded = !category.expanded;

    if (category.expanded && !(category.childs?.length)) {
      this.categoriesService.getCategoryWithChildren(category.id).subscribe(res => {
        category.childs = res.childs ?? [];
      });
    }
  }

  selectCategory(id: string) {
    this.selectedCategoryId = id;
    console.log('Выбрана категория с id:', id);
  }
}