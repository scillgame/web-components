import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlePassMiniStatusComponent } from './battle-pass-mini-status.component';

describe('BattlePassMiniStatusComponent', () => {
  let component: BattlePassMiniStatusComponent;
  let fixture: ComponentFixture<BattlePassMiniStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattlePassMiniStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlePassMiniStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
