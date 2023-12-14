import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; //dodala 
import dayGridPlugin from '@fullcalendar/daygrid'; //dodala instaliraj
import timeGridPlugin from '@fullcalendar/timegrid'; //dodala instaliraj 
//import dayGridYearPlugin from '@fullcalendar/daygrid-year';

@Component({
  selector: 'app-work-calendar',
  templateUrl: './work-calendar.component.html',
  styleUrls: ['./work-calendar.component.css']
})
export class WorkCalendarComponent {

  //primer kako dodati dogadjaje
  events = [
    {
      title: 'Meeting',
      start: '2023-12-10T10:00:00',
      end: '2023-12-10T12:00:00',
      /*extendedProps: {
        description: 'Neki opis' //ne prikaze mi?
      }*/
    },
    {
      title: 'Conference',
      start: '2023-12-10T13:00:00',
      end: '2023-12-10T15:00:00' 
    }
  ];
  

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,dayGridYear' // Dodali smo dayGridYear
    },
    buttonText: {
      year: 'Year',
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day', 
    },
    plugins: [dayGridPlugin, timeGridPlugin], // Dodali smo plugine
    initialView: 'dayGridMonth', // Prikaz počinje sa mesečnim prikazom
    weekends: true, // Prikazivanje vikenda
    editable: true, // Omogućavanje uređivanja događaja
    events: this.events// Dodaj ovu liniju za događaje
  //  selectable: true, // Omogućavanje selektovanja datuma/događaja
  //  dayMaxEvents: true, // Prikaži više događaja ako ima više od dayMaxEvents
  };

}
