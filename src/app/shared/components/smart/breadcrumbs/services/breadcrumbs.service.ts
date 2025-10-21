import { Injectable, signal } from '@angular/core';

export interface BreadcrumbItem {
  id?: string;
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  breadcrumb = signal<any[]>([]);

  constructor() {
    const saved = localStorage.getItem('breadcrumbs');
    if (saved) {
      try {
        this.breadcrumb.set(JSON.parse(saved));
      } catch {
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
