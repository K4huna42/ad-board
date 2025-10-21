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
  public breadcrumbsService = inject(BreadcrumbsService);

  public showBreadcrumbs = signal(false);

  public breadcrumbs: { title: string; url: string }[] = [];
  public mergedBreadcrumbs: { title: string; url: string }[] = [];

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects;

        this.showBreadcrumbs.set(url.includes('advert-view') || url.includes('my-adverts'));

        if (!this.showBreadcrumbs()) {
          this.mergedBreadcrumbs = [];
          return;
        }

        if (url.includes('my-adverts') && !url.includes('my-advert-view')) {
          this.mergedBreadcrumbs = [];
          return;
        }

        if (url.includes('my-advert-view')) {
          this.mergedBreadcrumbs = [{ title: 'Мои объявления', url: '/my-adverts' }];
          return;
        }

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

      if (config) {
        let path = config.path ?? '';

        if (path === '') {
          this.getBreadCrumb(route.children, url);
          return;
        }

        Object.entries(route.snapshot.params).forEach(([key, value]) => {
          path = path.replace(`:${key}`, value);
        });

        url += path ? `/${path}` : '';

        if (config.data?.['breadcrumb']) {
          const breadcrumb = {
            title: config.data['breadcrumb'],
            url,
          };
          this.breadcrumbs.push(breadcrumb);
        }
      }

      if (route.children.length) {
        this.getBreadCrumb(route.children, url);
      }
    });
  }
}
