// home.component.ts
import { Component } from '@angular/core';
import { UserService } from '../register/user.service';
import { Route } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private userService: UserService, private router: Router) {}

  redirectToLogin() {
    // Get the redirect URL from the service
    //const redirectUrl = this.userService.getLoginRedirectUrl();

    // Redirect to the external URL
    //window.location.href = redirectUrl;
  }

  redirectToAllCompanies(){
    this.router.navigate(['/companies']);
  }

  redirectToCompanyForm() {
    this.router.navigate(['company-form']);
  }

}
