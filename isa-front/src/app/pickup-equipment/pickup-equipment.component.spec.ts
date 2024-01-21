import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupEquipmentComponent } from './pickup-equipment.component';

describe('PickupEquipmentComponent', () => {
  let component: PickupEquipmentComponent;
  let fixture: ComponentFixture<PickupEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PickupEquipmentComponent]
    });
    fixture = TestBed.createComponent(PickupEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
