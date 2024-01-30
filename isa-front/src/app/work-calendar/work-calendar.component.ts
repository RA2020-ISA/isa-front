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
import { Company } from '../model/company.model';
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
  availableAppointments: Appointment[] = [];
  events: any[] = [];
  loggedUser?: User;
  company?: Company;

   
  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedInUser();
    console.log('Ulogovan admin', this.loggedUser);
    this.getAdminCompany();
    this.reservationService.getAdminsAppointmentReservation(this.loggedUser?.id || 0)
    .subscribe((result: Reservation[]) => {
          this.companyReservations = result;
          console.log('Reservations:', this.companyReservations);
          this.getAvailableAppointments();
         
      }
    );
  }

  getAdminCompany(): void{
    this.companyService.getCompanyByAdmin(this.loggedUser?.id || 0).subscribe(
      (company: Company) => {
        this.company = company;
        console.log("Kompanija:");
        console.log(this.company);
      },
      (error) => {
        console.error('Greška prilikom dobavljanja kompanije', error);
      }
    );
  }

  getAvailableAppointments():void{
    this.reservationService.getCompanyAvailableAppointments(this.loggedUser?.id || 0)
    .subscribe((result: Appointment[]) => {
          console.log('AVAILABLE', result);
          this.availableAppointments = result;
          this.addCalendarAppointments();
      }
    );
  }

  addCalendarAppointments(): void{
    for (const reservation of this.companyReservations) {
      if(reservation.appointment != null){
        this.findCalendarEvent(reservation);
      }
    }
    for (const appointemnt of this.availableAppointments) {
      this.findCalendarAvailableAEvent(appointemnt);
    }
    /*const calendarEvents: any[] = [];

    for(const event of this.events){
      if (event != null) {
        calendarEvents.push(event);
      }  
    }*/
    this.calendarOptions.events = this.events;
    //this.calendarOptions.events = calendarEvents;
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
          title: `RESERVED APPOINTMENT User info: ${reservation.user?.firstName} ${reservation.user?.lastName ?? 'Unknown'}`,
          start: appointmentStartDateTime,
          end: appointmentEndDateTime,
          color: 'lightcoral',
          textColor: 'black', 
          borderColor: 'black'
        };
        this.events.push(event);
      }
    }
  }

  findCalendarAvailableAEvent(appointment: Appointment): void {
    //console.log( 'wtff', appointment)
    if(appointment != null){
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
          title: `AVAILABLE APPOINMENT`,
          start: appointmentStartDateTime,
          end: appointmentEndDateTime,
          color: 'lightgreen',
          textColor: 'black', 
          borderColor: 'black'
        };
        this.events.push(event);
      }
    }
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
      const isAvailable = arg.event.title.includes('AVAILABLE')
      div.innerHTML = `<b>${arg.timeText}</b><br>${arg.event.title}`;
      
      div.style.borderRadius = '5px'; 
      div.style.padding = '4px'; 
      div.style.fontWeight = 'bold';
      div.style.fontSize = '12px';
      div.style.whiteSpace = 'normal'; // Tekst neće prelaziti u novi red
     // div.style.overflow = 'hidden'; // Ako tekst ne stane, biće skriven
      if (isAvailable) {
        div.style.backgroundColor = 'lightgreen';
        div.style.border = '2px solid darkgreen';
      } else {
        div.style.backgroundColor = 'lightcoral';
        div.style.border = '2px solid red'; 
      }

      return { domNodes: [div] };
    }
  };

}
