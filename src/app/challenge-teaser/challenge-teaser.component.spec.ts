import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeTeaserComponent } from './challenge-teaser.component';

describe('ChallengeTeaserComponent', () => {
  let component: ChallengeTeaserComponent;
  let fixture: ComponentFixture<ChallengeTeaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeTeaserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
