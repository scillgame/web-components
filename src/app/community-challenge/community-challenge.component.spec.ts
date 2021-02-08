import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityChallengeComponent } from './community-challenge.component';

describe('CommunityChallengeComponent', () => {
  let component: CommunityChallengeComponent;
  let fixture: ComponentFixture<CommunityChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityChallengeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
