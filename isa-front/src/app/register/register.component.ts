import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(private http: HttpClient) {}

  errorMessage: string | null = null;
  successMessage: string | null = null;

  save() {
    if (this.password !== this.confirmPassword) {
      return;
    }

    let bodyData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.http
      .post("http://localhost:8080/api/registration", bodyData, {
        responseType: "text",
      })
      .subscribe(
        (resultData: any) => {
          console.log(resultData);
          this.clearForm();
          this.successMessage =
            "Check your email for a confirmation link.";
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.errorMessage = error.error;
          const errorMessageObject = JSON.parse(
            this.errorMessage ?? "{}"
          );
          const message = errorMessageObject.message;
          this.errorMessage = message;
        }
      );
  }

  clearForm() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
  }
}






