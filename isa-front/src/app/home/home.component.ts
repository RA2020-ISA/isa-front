// home.component.ts
import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { CalendarOptions } from '@fullcalendar/core'; //dodala
import dayGridPlugin from '@fullcalendar/daygrid'; //dodala instaliraj
import timeGridPlugin from '@fullcalendar/timegrid'; //dodala instaliraj 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private userService: UserService, private router: Router) {}

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin], 
    height: 400, 
    events: [
      { title: 'Event 1', date: '2023-12-20' },
      { title: 'Event 2', date: '2023-12-25' },
    ],
  };

  calendarOptions1: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin], 
    height: 400, 
    events: [
      {
        title: 'NASLOOVVV EVO GA',
        start: '2023-12-20T10:00:00',
        end: '2023-12-20T16:00:00',
        display: 'background'
      }
    ]
  };

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
    this.router.navigate(['/company-form']);
  }

  redirectToAllEquipments(){
    this.router.navigate(['/all-equipment']);
  }

}
