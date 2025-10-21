import { Injectable, signal } from '@angular/core';
import { BreadcrumbItem } from '../domains/breadcrumb.interface';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  breadcrumb = signal<BreadcrumbItem[]>([]);

  constructor() {
    const saved = localStorage.getItem('breadcrumbs');
    if (saved) {
      try {
        this.breadcrumb.set(JSON.parse(saved));
      } catch (error) {
        console.error(error);
      }
    }
  }

  set(items: BreadcrumbItem[]) {
    this.breadcrumb.set(items);
    localStorage.setItem('breadcrumbs', JSON.stringify(items));
  }

  clear() {
    this.breadcrumb.set([]);
    localStorage.removeItem('breadcrumbs');
  }
}
