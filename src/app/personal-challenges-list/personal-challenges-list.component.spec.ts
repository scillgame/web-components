import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalChallengesListComponent } from './personal-challenges-list.component';

describe('PersonalChallengesListComponent', () => {
  let component: PersonalChallengesListComponent;
  let fixture: ComponentFixture<PersonalChallengesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalChallengesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalChallengesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
