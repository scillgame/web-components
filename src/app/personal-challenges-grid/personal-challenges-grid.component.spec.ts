import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalChallengesGridComponent } from './personal-challenges-grid.component';

describe('PersonalChallengesGridComponent', () => {
  let component: PersonalChallengesGridComponent;
  let fixture: ComponentFixture<PersonalChallengesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalChallengesGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalChallengesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
