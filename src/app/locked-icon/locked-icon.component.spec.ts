import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedIconComponent } from './locked-icon.component';

describe('LockedIconComponent', () => {
  let component: LockedIconComponent;
  let fixture: ComponentFixture<LockedIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockedIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
