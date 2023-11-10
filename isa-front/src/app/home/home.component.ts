import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  redirectToLogin() {
    // Redirect to the external URL
    window.location.href = 'HTTP://localhost:8080/login';
  }
}
