import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/smart/header/header.component';
import { FooterComponent } from './shared/components/dump/footer/footer.component';
import { AuthComponent } from './features/auth/auth.component';
import { UserDataApiService } from './shared/services/user-data-api.service';
import { BreadcrumbsComponent } from './shared/components/smart/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AuthComponent, BreadcrumbsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'ad-board';

  constructor(private userDataApiService: UserDataApiService){}

  ngOnInit(): void {
    
  }


}
