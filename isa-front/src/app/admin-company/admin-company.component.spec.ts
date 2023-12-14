import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompanyComponent } from './admin-company.component';

describe('AdminCompanyComponent', () => {
  let component: AdminCompanyComponent;
  let fixture: ComponentFixture<AdminCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCompanyComponent]
    });
    fixture = TestBed.createComponent(AdminCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
