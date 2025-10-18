import { Injectable, signal } from '@angular/core';

export interface BreadcrumbItem {
  id?: string;
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {

  breadcrumb = signal<any[]>([]);

  constructor() {
    const saved = localStorage.getItem('breadcrumbs');
    if (saved) {
      try {
        this.breadcrumb.set(JSON.parse(saved));
        console.log('♻️ Восстановлены хлебные крошки из localStorage');
      } catch {
        console.warn('⚠️ Ошибка при чтении сохранённых крошек');
      }
    }
  }

  set(items: BreadcrumbItem[]) {
    console.log('🟦 Установлены хлебные крошки:', items);
    this.breadcrumb.set(items);
    localStorage.setItem('breadcrumbs', JSON.stringify(items));
  }

  clear() {
    console.log('🟨 Хлебные крошки очищены');
    this.breadcrumb.set([]);
    localStorage.removeItem('breadcrumbs');
  }
}
