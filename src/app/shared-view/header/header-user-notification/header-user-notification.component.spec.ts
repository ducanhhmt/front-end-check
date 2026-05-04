import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderUserNotificationComponent } from './header-user-notification.component';

describe('HeaderUserNotificationComponent', () => {
  let component: HeaderUserNotificationComponent;
  let fixture: ComponentFixture<HeaderUserNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderUserNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderUserNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
