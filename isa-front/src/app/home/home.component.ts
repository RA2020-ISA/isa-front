// home.component.ts
import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

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
    this.router.navigate(['/login']);
  }

  redirectToAllCompanies(){
    this.router.navigate(['/companies']);
  }

  redirectToCompanyForm() {
    this.router.navigate(['company-form']);
  }

}
