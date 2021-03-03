import { TestBed } from '@angular/core/testing';

import { SCILLBattlePassService } from './scillbattle-pass.service';

describe('SCILLBattlePassService', () => {
  let service: SCILLBattlePassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SCILLBattlePassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
