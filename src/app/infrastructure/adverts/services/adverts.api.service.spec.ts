import { TestBed } from '@angular/core/testing';

import { AdvertsApiService } from './adverts.api.service';

describe('AdvertsApiService', () => {
  let service: AdvertsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvertsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
