import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdministratorsComponent } from './manage-administrators.component';

describe('ManageAdministratorsComponent', () => {
  let component: ManageAdministratorsComponent;
  let fixture: ComponentFixture<ManageAdministratorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAdministratorsComponent]
    });
    fixture = TestBed.createComponent(ManageAdministratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
