import { TestBed } from '@angular/core/testing';

import { ImagesApiService } from './images.api.service';

describe('ImagesApiService', () => {
  let service: ImagesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
