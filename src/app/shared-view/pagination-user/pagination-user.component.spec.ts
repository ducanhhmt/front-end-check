import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationUserComponent } from './pagination-user.component';

describe('PaginationUserComponent', () => {
  let component: PaginationUserComponent;
  let fixture: ComponentFixture<PaginationUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaginationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
