import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; //dodala 
import dayGridPlugin from '@fullcalendar/daygrid'; //dodala instaliraj
import timeGridPlugin from '@fullcalendar/timegrid'; //dodala instaliraj 
import { CompanyService } from '../services/company.service';
import { ReservationService } from '../services/reservation.service';
import { User } from '../model/user-model';
import { UserService } from '../services/user.service';
import { UserStateService } from '../services/user-state.service';
import { Appointment } from '../model/appointment.model';
import { Reservation } from '../model/reservation.model';
//import dayGridYearPlugin from '@fullcalendar/daygrid-year';

@Component({
  selector: 'app-work-calendar',
  templateUrl: './work-calendar.component.html',
  styleUrls: ['./work-calendar.component.css']
})
export class WorkCalendarComponent implements OnInit{

  
  constructor(private companyService: CompanyService, public userService: UserStateService, public reservationService: ReservationService) {}
  calendarAppointments: Appointment[] = [];
  events: any[] = [];
  loggedUser?: User;

   
  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedInUser();
    console.log(this.loggedUser);
    this.reservationService.getAdminsAppointmentReservation(this.loggedUser?.id || 0).subscribe(
      /* (result: Appointment[]) => {
          this.calendarAppointments = result;
          //console.log("Ispisi OVDE")
          console.log(this.calendarAppointments);
          this.createCalendarEvents();
      }, */
      (error) => {
        console.error('Greška', error);
      }
    );
  }

  createCalendarEvents() {
    this.calendarAppointments.forEach(appointment => {
      const dateArray = appointment.appointmentDate;
      
      // Check if dateArray is defined
      if (Array.isArray(dateArray) && dateArray.length >= 7) {
        // Convert the array to a LocalDateTime object
        const localDateTime = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5], dateArray[6] / 1000000);
        
        // Convert LocalDateTime to JavaScript Date
        const date = new Date(localDateTime);
        
        // Start time
        const startTime = new Date(`${date.toISOString().slice(0, 10)}T${appointment.appointmentTime}:00`);
  
        // Add duration to the startTime
        const endTime = new Date(startTime.getTime() + (appointment.appointmentDuration || 0) * 60000);
  
        const formattedStartTime = this.formatToISOString(startTime);
        const formattedEndTime = this.formatToISOString(endTime);
  
        // Create event object
        const event = {
          //title: appointment.user?.firstName + ' ' + appointment.user?.lastName,
          start: formattedStartTime,
          end: formattedEndTime
        };
  
        this.events.push(event);
      }
    });
  
    this.calendarOptions.events = this.events;
    console.log('Generated Events:');
    console.log(this.events);
  }
  
  formatToISOString(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
  
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }
  

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
    events: [], 
    eventContent: (arg, createElement) => {
      const div = document.createElement('div');
      div.innerHTML = `<b>${arg.timeText}</b><br>${arg.event.title}`;
      div.style.backgroundColor = 'lightgreen'; // Zelena pozadina
      div.style.color = 'red'; // Crni tekst
      div.style.border = '2px solid black'; // Deblja granica
      div.style.borderRadius = '5px'; // Zaobljeni ivici
      return { domNodes: [div] };
    }
  };

}
