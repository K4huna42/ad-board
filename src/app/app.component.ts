import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/smart/header/header.component';
import { FooterComponent } from './shared/components/dump/footer/footer.component';
import { AuthComponent } from './features/auth/auth.component';
import { FormRegistrationComponent } from './features/auth/components/form-registration/form-registration.component';
import { UserDataApiService } from './shared/services/user-data-api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AuthComponent, FormRegistrationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'ad-board';

  constructor(private userDataApiService: UserDataApiService){}

  ngOnInit(): void {
    
  }


}
