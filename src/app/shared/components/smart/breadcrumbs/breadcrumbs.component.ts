import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { BreadcrumbsService } from './services/breadcrumbs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterModule, CommonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent implements OnInit {
  private router = inject(Router);
  public breadcrumbsService = inject(BreadcrumbsService)

  public showBreadcrumbs = signal(false);

  public breadcrumbs: { title: string; url: string }[] = [];
  public mergedBreadcrumbs: { title: string; url: string }[] = [];

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;

        // показываем хлебные крошки только на страницах, где они нужны
        this.showBreadcrumbs.set(
          url.includes('advert-view') || url.includes('my-adverts')
        );

        if (!this.showBreadcrumbs()) {
          this.mergedBreadcrumbs = [];
          return;
        }

        // 🟦 Страница "Мои объявления"
        // 🟦 Страница "Мои объявления" — хлебные крошки НЕ показываем
        if (url.includes('my-adverts') && !url.includes('my-advert-view')) {
          this.mergedBreadcrumbs = [];
          return;
        }


        // 🟩 Просмотр объявления
        if (url.includes('my-advert-view')) {
          this.mergedBreadcrumbs = [
            { title: 'Мои объявления', url: '/my-adverts' },
          ];
          return;
        }

        // 🟨 Просмотр чужого объявления с категории
        if (url.includes('advert-view')) {
          this.mergedBreadcrumbs = [
            { title: 'Главная', url: '/' },
            ...this.breadcrumbsService.breadcrumb(),
          ];
          return;
        }
      });
  }

  getBreadCrumb(routes: ActivatedRoute[], url = ''): void {
    routes.forEach((route: ActivatedRoute) => {
      const config = route.routeConfig;

      console.log('📍 ROUTE PATH:', config?.path, 'DATA:', config?.data);

      if (config) {
        let path = config.path ?? '';

        // ⚙️ Пропускаем повторяющиеся пустые пути (когда несколько path: '' подряд)
        if (path === '' && url === '') {
          console.log('➡️ Первый уровень (главная) — оставляем');
        } else if (path === '') {
          console.log('🚫 Пропускаем второй пустой path');
          this.getBreadCrumb(route.children, url);
          return;
        }

        // 🔹 Подставляем параметры маршрута (например, /category/:id → /category/123)
        Object.entries(route.snapshot.params).forEach(([key, value]) => {
          path = path.replace(`:${key}`, value);
        });

        // 🔹 Добавляем сегмент в URL
        url += path ? `/${path}` : '';
        console.log('🧩 Текущий URL:', url);

        // 🔹 Если у маршрута есть data.breadcrumb — добавляем в крошки
        if (config.data?.['breadcrumb']) {
          const breadcrumb = {
            title: config.data['breadcrumb'],
            url,
          };
          console.log('✅ Добавляем крошку:', breadcrumb);
          this.breadcrumbs.push(breadcrumb);
        }
      }

      // 🔁 Рекурсивно обрабатываем дочерние маршруты
      if (route.children.length) {
        console.log('↪️ Спускаемся к детям:', route.children.length);
        this.getBreadCrumb(route.children, url);
      }
    });

    // 🧭 После прохода по всем маршрутам
    console.log('📋 Итоговые крошки:', this.breadcrumbs);
  }
}
