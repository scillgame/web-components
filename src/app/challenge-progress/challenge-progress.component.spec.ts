import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeProgressComponent } from './challenge-progress.component';

describe('ChallengeProgressComponent', () => {
  let component: ChallengeProgressComponent;
  let fixture: ComponentFixture<ChallengeProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
