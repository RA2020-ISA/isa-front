import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // dodala kalendar
import dayGridPlugin from '@fullcalendar/daygrid'; //dodala kalendar

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'isa-front';
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin]
  };
  
}

