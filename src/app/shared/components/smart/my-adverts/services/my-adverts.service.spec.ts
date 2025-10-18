import { TestBed } from '@angular/core/testing';

import { MyAdvertsService } from './my-adverts.service';

describe('MyAdvertsService', () => {
  let service: MyAdvertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyAdvertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
