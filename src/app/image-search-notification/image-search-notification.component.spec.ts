import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSearchNotificationComponent } from './image-search-notification.component';

describe('ImageSearchNotificationComponent', () => {
  let component: ImageSearchNotificationComponent;
  let fixture: ComponentFixture<ImageSearchNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSearchNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSearchNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
