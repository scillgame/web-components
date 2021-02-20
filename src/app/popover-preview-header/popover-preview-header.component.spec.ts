import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverPreviewHeaderComponent } from './popover-preview-header.component';

describe('PopoverPreviewHeaderComponent', () => {
  let component: PopoverPreviewHeaderComponent;
  let fixture: ComponentFixture<PopoverPreviewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopoverPreviewHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverPreviewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
