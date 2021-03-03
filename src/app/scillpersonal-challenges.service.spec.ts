import { TestBed } from '@angular/core/testing';

import { SCILLPersonalChallengesService } from './scillpersonal-challenges.service';

describe('SCILLPersonalChallengesService', () => {
  let service: SCILLPersonalChallengesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SCILLPersonalChallengesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
