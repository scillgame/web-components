import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSearchStatusComponent } from './image-search-status.component';

describe('ImageSearchStatusComponent', () => {
  let component: ImageSearchStatusComponent;
  let fixture: ComponentFixture<ImageSearchStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSearchStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSearchStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
