import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';
import { Equipment } from '../model/equipment.model';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';

@Component({
  selector: 'app-equipment-edit-form',
  templateUrl: './equipment-edit-form.component.html',
  styleUrls: ['./equipment-edit-form.component.css']
})
export class EquipmentEditFormComponent implements OnInit {
  equipmentId?: number;
  equipment?: Equipment;

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router, private userService: UserStateService) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.equipmentId = +params['id'];
      this.getEquipment();
    });
  }

  getEquipment(): void{
    this.service.getEquipmentById(this.equipmentId || 0).subscribe(
      (equipment: Equipment) => {
        this.equipment = equipment;
        console.log("Oprema:");
        console.log(this.equipment);
      },
      (error) => {
        console.error('Greška prilikom dobavljanja opreme', error);
      }
    );
  }

  onSubmit() {
    if (this.equipment) {
      console.log("Oprema za menjanje:");
      console.log(this.equipment);
      this.service.updateEquipment(this.equipment).subscribe(
        (updatetEquipment: Equipment) => {
          console.log('Equipment updated successfully:', updatetEquipment);
          this.router.navigate(['/admin-company']);
        },
        (error) => {
          console.error('Error updating equipment', error);
        }
      );
    }
  }

  decreaseQuantity() {
    if(this.equipment)
    {
      if (this.equipment.maxQuantity > 0) {
        this.equipment.maxQuantity--;
      }
    }
  }

  increaseQuantity() {
    if(this.equipment)
    {
      this.equipment.maxQuantity++;
    }
  }

}
