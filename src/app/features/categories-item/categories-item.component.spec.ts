import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesItemComponent } from './categories-item.component';

describe('CategoriesItemComponent', () => {
  let component: CategoriesItemComponent;
  let fixture: ComponentFixture<CategoriesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
