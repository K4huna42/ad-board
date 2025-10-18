import { TestBed } from '@angular/core/testing';

import { EditAdvertService } from './edit-advert.service';

describe('EditAdvertService', () => {
  let service: EditAdvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditAdvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
