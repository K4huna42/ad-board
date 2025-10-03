import { inject, Injectable } from '@angular/core';
import { CategoriesApiService } from '../../../infrastructure/categories/categories.api.service';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  parentId: string;
  childs?: Category[];
  expanded?: boolean;
  hasChildren?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private _open$ = new BehaviorSubject<boolean>(false);
  open$ = this._open$.asObservable();

  private categoriesApiService = inject(CategoriesApiService);

  toggle() {
    this._open$.next(!this._open$.value);
  }

  getRootCategories(): Observable<Category[]> {
    return this.categoriesApiService.getAllCategories();
  }

  getCategoryWithChildren(id: string): Observable<Category> {
    return this.categoriesApiService.getCategoryById(id);
  }
}


