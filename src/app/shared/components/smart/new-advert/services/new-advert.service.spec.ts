import { TestBed } from '@angular/core/testing';

import { NewAdvertService } from './new-advert.service';

describe('NewAdvertService', () => {
  let service: NewAdvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewAdvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
