import { inject, Injectable, signal } from '@angular/core';
import { CategoriesApiService } from '../../../infrastructure/categories/categories.api.service';
import { lastValueFrom } from 'rxjs';
import { Category, CategoryPath } from '../domains/category.interface';
import { ShortAdvertDtoInterface } from '../../../infrastructure/adverts/dto';
import { BreadcrumbsService } from '../../../shared/components/smart/breadcrumbs/services/breadcrumbs.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<string | null>(null);
  adverts = signal<ShortAdvertDtoInterface[]>([]);
  open = signal(false);

  private categoriesApiService = inject(CategoriesApiService);
  private breadcrumbsService = inject(BreadcrumbsService);

  private loadingIds = new Set<string>();

  toggle() {
    this.open.update((value) => !value);
  }

  loadAllCategories() {
    this.categoriesApiService.getAllCategories().subscribe((data: Category[]) => {
      const rootCategories = data
        .filter((cat) => cat.parentId === '00000000-0000-0000-0000-000000000000')
        .map((cat) => ({
          ...cat,
          expanded: false,
          childs: [],
          hasChildren: data.some((c) => c.parentId === cat.id),
        }));
      this.categories.set(rootCategories);
    });
  }

  tumblerCategory(category: Category): void {
    this.categories.update((cats) =>
      cats.map((cat) =>
        cat.id === category.id
          ? {
              ...cat,
              expanded: !cat.expanded,
              childs: !cat.expanded && !cat.childs?.length ? [] : cat.childs,
            }
          : cat,
      ),
    );

    if (!category.expanded) {
      this.categoriesApiService.getCategoryById(category.id).subscribe((res: Category) => {
        this.categories.update((cats) =>
          cats.map((cat) => (cat.id === category.id ? { ...cat, childs: res.childs ?? [] } : cat)),
        );
      });
    }
  }

  async setBreadcrumbByCategoryId(categoryId: string): Promise<void> {
    const path: CategoryPath[] = [];

    const fetchParentChain = async (id: string) => {
      try {
        const category = await lastValueFrom(this.categoriesApiService.getCategoryById(id));

        if (!category) {
          return;
        }
        path.push({
          id: category.id,
          name: category.name,
          parentId: category.parentId,
        });
        if (category.parentId && category.parentId !== '00000000-0000-0000-0000-000000000000') {
          await fetchParentChain(category.parentId);
        }
      } catch (err) {
        console.error('❌ fetchParentChain error for id', id, err);
      }
    };
    await fetchParentChain(categoryId);

    if (!path.length) {
      this.breadcrumbsService.clear();
      return;
    }

    const breadcrumbs = path.reverse().map((c) => ({
      title: c?.name,
      url: `/category/${c?.id}`,
    }));

    this.breadcrumbsService.set(breadcrumbs);
  }
}
