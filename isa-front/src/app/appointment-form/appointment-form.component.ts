import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Company } from '../model/company.model';
import { UserService } from '../services/user.service';
import { EquipmentAppointment } from '../model/equipment-appointment.model';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  equipmentId?: number;
  loggedUser?: User;

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
    this.loggedUser = this.userStateService.getLoggedInUser();
    if (this.loggedUser) {
      console.log("Ulogovani korisnik termin:");
      console.log(this.loggedUser);
    } else {
      console.log('Nije ulogovan nijedan korisnik!');
    }
  }

  createAppointment(): void {
    const datum = this.appointmentForm.value.datum;
    const vreme = this.appointmentForm.value.vreme;
    const trajanje = this.appointmentForm.value.trajanje;
    const newAppointment: EquipmentAppointment = {
      equipmentId: this.equipmentId || 0,
      adminId: this.loggedUser?.id || 0,
      adminName: this.loggedUser?.firstName || '',
      adminSurname: this.loggedUser?.lastName || '',
      appointmentDate: datum,
      appointmentTime: vreme,
      appointmentDuration: trajanje
    };

    console.log('Napravljena kompanija:');
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
  }
}
