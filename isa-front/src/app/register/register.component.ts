import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService], // Add the service to the providers
})
export class RegisterComponent {
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

  constructor(private userService: UserService) {}

  save() {
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
      companyInfo: this.companyInfo,
    };

    this.userService.registerUser(bodyData).subscribe(
      (resultData: any) => {
        console.log(resultData);
        this.clearForm();
        this.successMessage =
          'Check your email for a confirmation link.';
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.errorMessage = error.error;
        const errorMessageObject = JSON.parse(
          this.errorMessage ?? '{}'
        );
        const message = errorMessageObject.message;
        this.errorMessage = message;
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
    this.companyInfo = '';
    this.errorMessage='';
  }
}
