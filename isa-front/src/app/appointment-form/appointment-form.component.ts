import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Company } from '../model/company.model';
import { UserService } from '../services/user.service';
import { Appointment } from '../model/appointment.model';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';
import { Time } from '@angular/common';
import { DatePipe } from '@angular/common';
import { AppointmentStatus } from '../model/appointment-status';
//import { ex } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'], 
  providers: [DatePipe]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  loggedUser?: User;
  company?: Company;
  message?: string = '';
  allAppointments: Appointment[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private service: CompanyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private userStateService: UserStateService,
    private datePipe: DatePipe
  ) {
    // Inicijalizujemo formu u konstruktoru
    this.appointmentForm = this.formBuilder.group({
      datum: ['', Validators.required], // polje za datum
      vreme: ['', Validators.required], // polje za vreme
      trajanje: ['', Validators.required] // polje za trajanje
    });
  }

  ngOnInit(): void {
    this.loggedUser = this.userStateService.getLoggedInUser();
    if (this.loggedUser) {
      console.log("Ulogovani korisnik termin:");
      console.log(this.loggedUser);
      this.getCompany();
    } else {
      console.log('Nije ulogovan nijedan korisnik!');
    }
  }

  getCompany(): void{
    if(this.loggedUser && this.loggedUser.id){
      this.service.getCompanyByAdmin(this.loggedUser.id).subscribe(
        (result: Company) => {
          console.log('Kompanija:');
          console.log(result);
          console.log('Id usera:');
          console.log(this.loggedUser?.id);
          this.company = result;  // Postavi vrednost company ovde
          this.getAllAppointments();
        },
        (error) => {
          console.error('Greška prilikom dobavljanja kompanije za admina!', error);
        }
      );
    }
  }

  getAllAppointments(): void{
    this.service.getAllAppointments().subscribe(
      (result: Appointment[]) => {
        console.log('Svi definisani termini za preuzimanje:');
        console.log(result);
        this.allAppointments = result;  // Postavi vrednost company ovde
      },
      (error) => {
        console.error('Greška prilikom dobavljanja svih definisanih termina za preuzimanje opreme!', error);
      }
    );
  }

  createAppointment(): void {
      const vreme = this.appointmentForm.value.vreme;
      const trajanje = this.appointmentForm.value.trajanje;
      const datumString: string = this.appointmentForm.value.datum;
      const datum: Date = new Date(datumString);
      const danas: Date = new Date();  // Danasnjeg datuma

      // Ako je uneti datum manji ili jednak od danasnjeg datuma
      if (datum <= danas) {
        console.error('Datum nije validan. Uneseni datum mora biti posle danasnjeg datuma.');
        this.message = 'Datum nije validan. Uneseni datum mora biti posle danasnjeg datuma.';
        return;  // Prekini funkciju i ne pravi termin
      }
    
      const appointmentTime: Time = this.parseTimeStringToTime(vreme);
    
      const durationInMinutes: number = +trajanje;
    
      const workTimeBegin: Time = this.parseTimeStringToTime(this.company?.workTimeBegin || '');
      const workTimeEnd: Time = this.parseTimeStringToTime(this.company?.workTimeEnd || '');
    
      const isWithinWorkTimeRange: boolean =
        this.isTimeWithinRange(appointmentTime, workTimeBegin, workTimeEnd);
    
      const isEndTimeWithinWorkTimeRange: boolean =
        this.isTimeWithinRange(this.addMinutes(appointmentTime, durationInMinutes), workTimeBegin, workTimeEnd);
    
      if (isWithinWorkTimeRange && isEndTimeWithinWorkTimeRange) {
        const newAppointment: Appointment = {
          adminId: this.loggedUser?.id || 0,
          appointmentDate: datum,
          appointmentTime: vreme,
          appointmentDuration: trajanje,
          status: AppointmentStatus.FREE
        };

        if (this.existsSameAppointment(newAppointment))
        {
          console.error('Vec postoji isti ovaj termin za preuzimanje.');
          this.message = 'Vec ste definisali ovaj termin za preuzimanje opreme.';
          return;
        }

        if (this.doesNewAppointmentOverlap(newAppointment))
        {
          console.error('Novi termin za preuzimanje opreme se preklapa sa vec postojecim.');
          this.message = 'Novi termin za preuzimanje opreme se preklapa sa vec postojecim.';
          return;
        }
    
        console.log('Napravljeni termin za preuzimanje:');
        console.log(newAppointment);
    
        this.service.createAppointment(newAppointment).subscribe(
          (result: Appointment) => {
            console.log('New appointment:');
            console.log(result);
            this.router.navigate(['/admin-company']);
          },
          (error) => {
            console.error('Greška prilikom kreiranja termina preuzimanja', error);
          }
        );
      } else {
        console.error('Vreme nije u opsegu radnog vremena ili završetak termina nije u opsegu radnog vremena.');
        this.message = 'Navedeno vreme nije u opsegu radnog vremena kompanije!';
      }
  
  }

  
  existsSameAppointment(newAppointment: Appointment): boolean {
    return this.allAppointments.some(existingAppointment => {
      const formattedExistingDate = this.formatAppointmentDate(existingAppointment.appointmentDate);
      const formattedNewDate = this.formatAppointmentDate(newAppointment.appointmentDate);
  
      return (
        formattedExistingDate === formattedNewDate &&
        existingAppointment.appointmentTime === newAppointment.appointmentTime &&
        existingAppointment.appointmentDuration === newAppointment.appointmentDuration &&
        existingAppointment.adminId === newAppointment.adminId
      );
    });
  }
  
  doesNewAppointmentOverlap(newAppointment: Appointment): boolean {
    const formattedNewDate = this.formatAppointmentDate(newAppointment.appointmentDate);
  
    // Provera preklapanja sa svakim postojećim terminom
    return this.allAppointments.some(existingAppointment => {
      const formattedExistingDate = this.formatAppointmentDate(existingAppointment.appointmentDate);
  
      if (
        existingAppointment.adminId === newAppointment.adminId &&
        formattedExistingDate === formattedNewDate &&
        existingAppointment.appointmentTime !== undefined &&
        existingAppointment.appointmentDuration !== undefined &&
        newAppointment.appointmentTime !== undefined &&
        newAppointment.appointmentDuration !== undefined
      ) {
        const existingStartTime = this.parseTimeStringToTime(existingAppointment.appointmentTime);
        const existingEndTime = this.addMinutes(existingStartTime, existingAppointment.appointmentDuration);
  
        const newStartTime = this.parseTimeStringToTime(newAppointment.appointmentTime);
        const newEndTime = this.addMinutes(newStartTime, newAppointment.appointmentDuration);
  
        // Provera preklapanja vremena
        if (
          (this.compareTimes(newStartTime, existingEndTime) <= 0 && this.compareTimes(newEndTime, existingStartTime) >= 0) ||
          (this.compareTimes(existingStartTime, newEndTime) <= 0 && this.compareTimes(existingEndTime, newStartTime) >= 0)
        ) {
          return true; // Postoje preklapanja
        }
      }
  
      return false; // Nema preklapanja za trenutni existingAppointment
    });
  }
  
  
  
  // Funkcija za formatiranje datuma
  formatAppointmentDate(date: Date | number | undefined): string {
    console.log(' U FORMATIRANJU DATUM: ');
    console.log(date);
  
    if (date instanceof Date) {
      return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm') || '';
    } else if (typeof date === 'number') {
      const dateObject = new Date(date);
      return this.datePipe.transform(dateObject, 'yyyy-MM-dd HH:mm') || '';
    }
  
    return '';
  }
  
  

  parseTimeStringToTime(timeString: string): Time {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }
  isTimeWithinRange(time: Time, rangeStart: Time, rangeEnd: Time): boolean {
    return this.compareTimes(time, rangeStart) >= 0 && this.compareTimes(time, rangeEnd) <= 0;
  }
  
  compareTimes(time1: Time, time2: Time): number {
    if (time1.hours === time2.hours) {
      return time1.minutes - time2.minutes;
    }
    return time1.hours - time2.hours;
  }
  
  addMinutes(time: Time, minutes: number): Time {
    const totalMinutes = time.hours * 60 + time.minutes + minutes;
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  }
}
