import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverPreviewBpSectionComponent } from './popover-preview-bp-section.component';

describe('PopoverPreviewBpSectionComponent', () => {
  let component: PopoverPreviewBpSectionComponent;
  let fixture: ComponentFixture<PopoverPreviewBpSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopoverPreviewBpSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverPreviewBpSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
