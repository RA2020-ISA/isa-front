import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Company } from '../model/company.model';
import { UserService } from '../services/user.service';
import { EquipmentAppointment } from '../model/equipment-appointment.model';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';
import { Time } from '@angular/common';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  equipmentId?: number;
  loggedUser?: User;
  companyId?: number;
  company?: Company;
  message?: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private service: CompanyService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private userStateService: UserStateService
  ) {
    // Inicijalizujemo formu u konstruktoru
    this.appointmentForm = this.formBuilder.group({
      datum: ['', Validators.required], // polje za datum
      vreme: ['', Validators.required], // polje za vreme
      trajanje: ['', Validators.required] // polje za trajanje
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.equipmentId = +params['id'];
    });
    this.route.params.subscribe(params => {
      this.companyId = +params['comid'];
      this.getCompany();
    });
    this.loggedUser = this.userStateService.getLoggedInUser();
    if (this.loggedUser) {
      console.log("Ulogovani korisnik termin:");
      console.log(this.loggedUser);
    } else {
      console.log('Nije ulogovan nijedan korisnik!');
    }
  }

  getCompany(): void{
    if (this.companyId) {
      this.service.getCompany(this.companyId).subscribe(
        (result: Company) => {
          console.log('Kompanija:');
          console.log(result);
          this.company = result;  // Postavi vrednost company ovde
        },
        (error) => {
          console.error('Greška prilikom dobavljanja kompanije', error);
        }
      );
    }
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
        const newAppointment: EquipmentAppointment = {
          equipmentId: this.equipmentId || 0,
          adminId: this.loggedUser?.id || 0,
          adminName: this.loggedUser?.firstName || '',
          adminSurname: this.loggedUser?.lastName || '',
          appointmentDate: datum,
          appointmentTime: vreme,
          appointmentDuration: trajanje
        };
    
        console.log('Napravljeni termin za preuzimanje:');
        console.log(newAppointment);
    
        this.service.createAppointment(newAppointment).subscribe(
          (result: EquipmentAppointment) => {
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
