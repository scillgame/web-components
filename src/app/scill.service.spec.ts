import { TestBed } from '@angular/core/testing';

import { SCILLService } from './scill.service';

describe('SCILLService', () => {
  let service: SCILLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SCILLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
