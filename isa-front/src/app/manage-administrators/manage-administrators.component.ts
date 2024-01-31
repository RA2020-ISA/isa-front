import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';
import { EquipmentService } from '../services/equipment.service';
import { Appointment } from '../model/appointment.model';
import { Location } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserRole } from '../model/user-role-enum';

@Component({
  selector: 'app-manage-administrators',
  templateUrl: './manage-administrators.component.html',
  styleUrls: ['./manage-administrators.component.css'], 
  providers: [UserService], //Nisam sigurna da li treba
})
export class ManageAdministratorsComponent{
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  city: string = '';
  country: string = '';
  phoneNumber: string = '';
  occupation: string = '';
  companyInfo: string = '';

  errorMessage: string | null = null;
  successMessage: string | null = null;


  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router, private userService: UserService, public userStateService: UserStateService) {}

  makeSystemAdmin(): void {
    if (this.password !== this.confirmPassword) {
      return;
    }

    let bodyData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      city: this.city,
      country: this.country,
      phoneNumber: this.phoneNumber,
      occupation: this.occupation,
    };

    this.userService.registerSystemAdmin(bodyData).subscribe(
      (resultData: User) => {
        console.log(resultData);
        this.clearForm();
        this.successMessage =
          'Susccessfuly registered new system admin.' + this. firstName + this.lastName;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  clearForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.city = '';
    this.country = '';
    this.phoneNumber = '';
    this.occupation = '';
    this.errorMessage='';
  }
}
