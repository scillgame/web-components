import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverPreviewSectionComponent } from './popover-preview-section.component';

describe('PopoverPreviewSectionComponent', () => {
  let component: PopoverPreviewSectionComponent;
  let fixture: ComponentFixture<PopoverPreviewSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopoverPreviewSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverPreviewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
