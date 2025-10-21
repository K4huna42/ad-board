import { inject, Injectable, signal } from '@angular/core';
import { CategoriesApiService } from '../../../infrastructure/categories/categories.api.service';
import { BehaviorSubject, Observable, lastValueFrom, map } from 'rxjs';
import { Category } from '../domains/category.interface';
import { AdvertsApiService } from '../../../infrastructure/adverts/services/adverts.api.service';
import {
  AdvertSearchRequestDto,
  ShortAdvertDtoInterface,
} from '../../../infrastructure/adverts/dto';
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

  // защита от повторных параллельных запросов по одному id
  private loadingIds = new Set<string>();

  toggle() {
    this.open.update((value) => !value);
  }

  loadAllCategories() {
    this.categoriesApiService.getAllCategories().subscribe((data: Category[]) => {
      const rootCategories = data
        .filter((cat) => cat.parentId === '00000000-0000-0000-0000-000000000000')
        .map((cat) => ({
          // Преобразуем каждую корневую категорию:
          ...cat, // копируем все оригинальные свойства
          expanded: false, // по умолчанию свернута
          childs: [], // пока пустой массив подкатегорий
          hasChildren: data.some((c) => c.parentId === cat.id),
          // проверяем, есть ли у этой категории дети (через some в общем списке data)
        }));
      this.categories.set(rootCategories); // Устанавливаем сигналу categories новое значение — массив корневых категорий
    });
  }

  tumblerCategory(category: Category): void {
    // Метод, который "переключает" состояние конкретной категории: раскрыть или свернуть
    this.categories.update(
      (
        cats, // Обновляем состояние categories
      ) =>
        cats.map(
          (
            cat, // Для каждой категории (cat) проверяем:
          ) =>
            cat.id === category.id
              ? {
                  // Если cat.id === category.id, то это та категория, по которой кликнули
                  ...cat,
                  expanded: !cat.expanded, // Переключаем её expanded
                  childs:
                    !cat.expanded && !cat.childs?.length
                      ? //Если мы только что открываем (!cat.expanded раньше был false), и у неё ещё нет подкатегорий (childs пуст)
                        [] // то временно ставим []
                      : cat.childs,
                }
              : cat,
        ),
    );

    if (!category.expanded) {
      // Проверяем: если категория только что раскрылась (раньше была false), нужно загрузить подкатегории с сервера.
      this.categoriesApiService.getCategoryById(category.id).subscribe((res: Category) => {
        this.categories.update(
          (
            cats, // После получения данных — снова обновляем сигнал:
          ) =>
            cats.map(
              (cat) =>
                cat.id === category.id // Находим нужную категорию по id
                  ? { ...cat, childs: res.childs ?? [] }
                  : // Присваиваем ей поле childs, взятое из ответа res.childs (или пустой массив, если нет подкатегорий)
                    cat, // Остальные категории остаются без изменений
            ),
        );
      });
    }
  }

  async setBreadcrumbByCategoryId(categoryId: string): Promise<void> {

    // ✅ объявляем path заранее
    const path: any[] = [];

    const fetchParentChain = async (id: string) => {
      try {
        const category = await lastValueFrom(this.categoriesApiService.getCategoryById(id));

        if (!category) {
          return;
        }

        // добавляем в цепочку
        path.push({
          id: category.id,
          name: category.name,
          parentId: category.parentId,
        });

        // если есть родитель, продолжаем вверх
        if (category.parentId && category.parentId !== '00000000-0000-0000-0000-000000000000') {
          await fetchParentChain(category.parentId);
        }
      } 
      catch (err) {
        console.error('❌ fetchParentChain error for id', id, err);
      }
    };

    // ✅ вызываем цепочку и ждём завершения
    await fetchParentChain(categoryId);

    if (!path.length) {
      this.breadcrumbsService.clear();
      return;
    }

    // инвертируем порядок (от корня к выбранной)
    const breadcrumbs = path.reverse().map((c) => ({
      title: c.name,
      url: `/category/${c.id}`,
    }));

    this.breadcrumbsService.set(breadcrumbs);
  }
}
