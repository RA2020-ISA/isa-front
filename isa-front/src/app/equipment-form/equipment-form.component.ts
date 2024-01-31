import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Company } from '../model/company.model';
import { UserService } from '../services/user.service';
import { Appointment } from '../model/appointment.model';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';
import { Time } from '@angular/common';
import { DatePipe } from '@angular/common';
import { AppointmentStatus } from '../model/appointment-status';
import { ToastrService } from 'ngx-toastr';
import { Equipment } from '../model/equipment.model';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css'],
  providers: [DatePipe]
})
export class EquipmentFormComponent implements OnInit{
  equipmentForm: FormGroup;
  loggedUser?: User;
  company?: Company;
  message?: string = '';
  companyId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private toastr: ToastrService,
    public userStateService: UserStateService
  ) {
    this.equipmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      maxQuantity: ['', [Validators.required, Validators.min(0)]],
      grade: ['', Validators.required], // Dodato polje za ocenu
      type: ['', Validators.required] // Dodato polje za tip
    });
  }

  ngOnInit(): void {
    this.loggedUser = this.userStateService.getLoggedInUser();
    this.route.params.subscribe(params => {
      this.companyId = +params['id'];
      this.companyService.getCompany(this.companyId).subscribe(
        (company: Company) => {
          this.company = company;
        },
        (error) => {
          console.error('Error fetching company', error);
        }
      );
    });
  }

  checkValidation(): boolean{
    const name =  this.equipmentForm.value.name;
    const description = this.equipmentForm.value.description;
    const price = this.equipmentForm.value.price;
    const maxQuantity = this.equipmentForm.value.maxQuantity;
    const grade =  this.equipmentForm.value.grade;
    const type =  this.equipmentForm.value.type;
    const gradeFloat = parseFloat(grade);
    const priceFloat = parseFloat(price);
    if(name == '' || description == '' || price == '' || maxQuantity == '' || grade == '' || type == '')
    {
      this.message = 'You must enter all the fields';
      return false;
    }
    if(gradeFloat < 1 || gradeFloat > 5)
    {
      this.message = 'Grade must be number between 1 and 5!';
      return false;
    }
    if(priceFloat < 0)
    {
      this.message = 'Price must be number above 0!';
      return false;
    }
    return true;
  }

  createEquipment() {
    if(!this.checkValidation())
    {
      return;
    }

    if (this.company) {
      const newEquipment: Equipment = {
        name: this.equipmentForm.value.name,
        description: this.equipmentForm.value.description,
        price: this.equipmentForm.value.price,
        maxQuantity: this.equipmentForm.value.maxQuantity,
        grade: this.equipmentForm.value.grade,
        type: this.equipmentForm.value.type,
        company: this.company
      };

      console.log('Oprema koju saljem na kreiranje:');
      console.log(newEquipment);

      this.companyService.createEquipment(newEquipment).subscribe(
        (createdEquipment: Equipment) => {
          this.toastr.success('Equipment created successfully!');
          this.router.navigate(['/admin-company']);
        },
        (error) => {
          this.toastr.error('Error creating equipment!');
          console.error('Error creating equipment', error);
        }
      );
    } else {
      this.toastr.error('Please fill in all required fields.');
    }
  }

  decreaseQuantity() {
    const maxQuantityControl = this.equipmentForm.get('maxQuantity');
    if (maxQuantityControl) {
      const currentValue = maxQuantityControl.value;
      if (currentValue > 0) {
        maxQuantityControl.setValue(currentValue - 1);
      }
    }
  }

  increaseQuantity() {
    const maxQuantityControl = this.equipmentForm.get('maxQuantity');
    if (maxQuantityControl) {
      const currentValue = maxQuantityControl.value;
      maxQuantityControl.setValue(currentValue + 1);
    }
  }
}
