import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalChallengesComponent } from './personal-challenges.component';

describe('PersonalChallengesComponent', () => {
  let component: PersonalChallengesComponent;
  let fixture: ComponentFixture<PersonalChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalChallengesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
