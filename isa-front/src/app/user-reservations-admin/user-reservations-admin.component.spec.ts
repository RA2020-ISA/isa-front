import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReservationsAdminComponent } from './user-reservations-admin.component';

describe('UserReservationsAdminComponent', () => {
  let component: UserReservationsAdminComponent;
  let fixture: ComponentFixture<UserReservationsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReservationsAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserReservationsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
