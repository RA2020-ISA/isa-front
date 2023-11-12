// home.component.ts
import { Component } from '@angular/core';
import { UserService } from '../register/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private userService: UserService) {}

  redirectToLogin() {
    // Get the redirect URL from the service
    const redirectUrl = this.userService.getLoginRedirectUrl();

    // Redirect to the external URL
    window.location.href = redirectUrl;
  }
}
