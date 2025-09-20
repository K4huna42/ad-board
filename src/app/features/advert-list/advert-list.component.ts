import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdvertComponent } from '../advert/advert.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShortAdvert } from './domains';
import { AdvertService } from '../../shared/services/advert.service';
import { Observable, take } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-advert-list',
  standalone:true,
  imports: [CommonModule, AdvertComponent, RouterModule],
  templateUrl: './advert-list.component.html',
  styleUrl: './advert-list.component.scss'
})
export class AdvertListComponent implements OnInit {

  advertForm: FormGroup;
  responceAdvert$!: Observable<ShortAdvert[]>;
  
  constructor(
    private fb: FormBuilder,
    private advertService:AdvertService,
    private router:Router
  ){
    this.advertForm = this.fb.group({
      search: null,
      showNonActive: true,
      category: null
    });
  }

  ngOnInit(): void {
    this.responceAdvert$ = this.advertService.responceAdvert$;
    this.advertService.getAdverts(this.advertForm.value)
  }
}
