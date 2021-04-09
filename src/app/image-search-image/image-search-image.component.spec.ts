import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSearchImageComponent } from './image-search-image.component';

describe('ImageSearchImageComponent', () => {
  let component: ImageSearchImageComponent;
  let fixture: ComponentFixture<ImageSearchImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSearchImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSearchImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
