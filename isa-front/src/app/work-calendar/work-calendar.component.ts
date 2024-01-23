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
  datePipe: any;

  
  constructor(private companyService: CompanyService, public userService: UserStateService, public reservationService: ReservationService) {}
  calendarAppointments: Appointment[] = [];
  companyReservations: Reservation[] = [];
  events: any[] = [];
  loggedUser?: User;

   
  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedInUser();
    console.log('Ulogovan admin', this.loggedUser);
    this.reservationService.getAdminsAppointmentReservation(this.loggedUser?.id || 0)
    .subscribe((result: Reservation[]) => {
          this.companyReservations = result;
          console.log('Reservations:', this.companyReservations);
          this.addCalendarAppointments();
          this.createCalendarEvents();
      }
    );
  }

  addCalendarAppointments(): void{
    
    /*for (const reservation of this.companyReservations) {
      if(reservation.appointment != null){
        this.calendarAppointments.push(reservation.appointment);
      }
    }*/
    for (const reservation of this.companyReservations) {
      if(reservation.appointment != null){
        this.findCalendarEvent(reservation);
      }
    }
    this.calendarOptions.events = this.events;
  }

  findCalendarEvent(reservation: Reservation): void {
    if(reservation.appointment != null){
      const appointmentDate: Date = new Date(reservation.appointment.appointmentDate ?? new Date());
      const appointmentStartTime: string | undefined = reservation.appointment.appointmentTime;
      const appointmentDuration: number | undefined = reservation.appointment.appointmentDuration;
      if (appointmentStartTime !== undefined && appointmentDuration !== undefined) {
        const [hour, minute] = appointmentStartTime.split(':').map(Number);
        const appointmentStartDateTime = new Date(appointmentDate);
        appointmentStartDateTime.setHours(hour, minute);
        const appointmentEndDateTime = new Date(appointmentStartDateTime.getTime() + appointmentDuration * 60000);
  
        // Create event object
        const event = {
          title: `User: ${reservation.user?.firstName} ${reservation.user?.lastName ?? 'Unknown'}`,
          start: appointmentStartDateTime,
          end: appointmentEndDateTime,
        };
        this.events.push(event);
      }
    }
  }

  createCalendarEvents(): void {
    this.calendarAppointments.forEach(appointment => {
      const appointmentDate: Date = new Date(appointment.appointmentDate ?? new Date());
      const appointmentStartTime: string | undefined = appointment.appointmentTime;
      const appointmentDuration: number | undefined = appointment.appointmentDuration;
  
      if (appointmentStartTime !== undefined && appointmentDuration !== undefined) {
        const [hour, minute] = appointmentStartTime.split(':').map(Number);
        const appointmentStartDateTime = new Date(appointmentDate);
        appointmentStartDateTime.setHours(hour, minute);
        const appointmentEndDateTime = new Date(appointmentStartDateTime.getTime() + appointmentDuration * 60000);
  
        // Create event object
        const event = {
          title: 'Rezervacije od-do:', 
          start: appointmentStartDateTime,
          end: appointmentEndDateTime,
        };
  
        this.events.push(event);
      }
    });
  
    this.calendarOptions.events = this.events;
    console.log('Generated Events:');
    console.log(this.events);
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
      div.style.backgroundColor = 'yellow'; // Zelena pozadina
      div.style.color = 'darkgreen'; // Crni tekst
      div.style.border = '2px solid darkgreen'; // Deblja granica
      div.style.borderRadius = '5px'; // Zaobljeni ivici
      div.style.padding = '4px'; // Dodajte padding za povećanje veličine
      div.style.fontWeight = 'bold';
      div.style.fontSize = '14px';
      return { domNodes: [div] };
    }
  };

}
