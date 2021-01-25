import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlePassStatusComponent } from './battle-pass-status.component';

describe('BattlePassStatusComponent', () => {
  let component: BattlePassStatusComponent;
  let fixture: ComponentFixture<BattlePassStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattlePassStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlePassStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
