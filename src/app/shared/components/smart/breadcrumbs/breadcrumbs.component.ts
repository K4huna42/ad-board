import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public breadcrumbs: { title: string; url: string }[] = [];

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs = [];
      this.getBreadCrumb(this.activatedRoute.children);
    });
  }

  getBreadCrumb(route: ActivatedRoute[], url = ''): void {
    route.forEach((route: ActivatedRoute) => {
      if (route.routeConfig) {
        let path = route.routeConfig.path ?? '';

        Object.entries(route.snapshot.params).forEach(([key, value]) => {
          path = path.replace(`:${key}`, value);
        });

        url += path ? `/${path}` : '';

        if (route.routeConfig.data?.['breadcrumb']) {
          this.breadcrumbs.push({
            title: route.routeConfig.data['breadcrumb'],
            url,
          });
        }
      }

      if (route.children.length) {
        this.getBreadCrumb(route.children, url);
      }
    });
  }
}
