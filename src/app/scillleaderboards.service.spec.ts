import { TestBed } from '@angular/core/testing';

import { SCILLLeaderboardsService } from './scillleaderboards.service';

describe('SCILLLeaderboardsService', () => {
  let service: SCILLLeaderboardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SCILLLeaderboardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
