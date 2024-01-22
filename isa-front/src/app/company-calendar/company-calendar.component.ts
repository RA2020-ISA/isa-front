import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; 
import { EquipmentAppointment } from '../model/equipment-appointment.model';
import { CompanyService } from '../services/company.service';
import { UserService } from '../services/user.service';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-company-calendar',
  templateUrl: './company-calendar.component.html',
  styleUrls: ['./company-calendar.component.css']
})
export class CompanyCalendarComponent implements OnInit{
/*  */
  calendarAppointments: EquipmentAppointment[] = [];
  events: any[] = [];

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
      div.style.color = 'black'; // Crni tekst
      div.style.border = '2px solid black'; // Deblja granica
      div.style.borderRadius = '5px'; // Zaobljeni ivici
      return { domNodes: [div] };
    }
  };

  constructor(private companyService: CompanyService, public userStateService: UserStateService) {}
  
  ngOnInit(): void {
    this.companyService.getFreeCompanyAppoinments().subscribe(
      (result: EquipmentAppointment[]) => {
          this.calendarAppointments = result;
          //console.log("Ispisi OVDE")
          console.log(this.calendarAppointments);
          this.createCalendarEvents();
      },
      (error) => {
        console.error('Greška', error);
      }
    );
  }

  createCalendarEvents() {
    this.calendarAppointments.forEach(appointment => {
      const datePart = new Date(appointment.appointmentDate).toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
      // Start time
      const startTime = new Date(`${datePart}T${appointment.appointmentTime}:00`);
 
      // Assuming duration is in minutes
      const endTime = new Date(startTime.getTime() + appointment.appointmentDuration * 60000);

      const formattedStartTime = this.formatToISOString(startTime);
      const formattedEndTime = this.formatToISOString(endTime);
  
      // Create event object
      const event = {
        title: appointment.adminName + ' ' +  appointment.adminSurname, //ovo izmeni na nesto bolje
        start: formattedStartTime,
        end: formattedEndTime
      };
  
      this.events.push(event); 
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
  
}
