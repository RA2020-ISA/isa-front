import { Component, OnInit } from '@angular/core';
import { User } from '../model/user-model';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';
import { Equipment } from '../model/equipment.model';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { Reservation } from '../model/reservation.model';
import { ReservationService } from '../services/reservation.service';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-reservations-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-reservations-admin.component.html',
  styleUrl: './user-reservations-admin.component.css',
  providers: [Location]  
})
export class UserReservationsAdminComponent implements OnInit{
  users: User[] = [];
  company?: Company;
  loggedUser?: User;
  companyEquipments: Equipment[] = [];
  allReservations: Reservation[] = [];

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router, public userService: UserStateService,
    private location: Location, private reservationService: ReservationService) {}

  ngOnInit(): void {
      this.loggedUser = this.userService.getLoggedInUser();
      if (this.loggedUser) {
        console.log("Ulogovani korisnik je sad:");
        console.log(this.loggedUser);
        this.getAdminCompany();
      } else {
        console.log('Nije ulogovan nijedan korisnik!');
      }
  }

  getAdminCompany(): void{
    this.service.getCompanyByAdmin(this.loggedUser?.id || 0).subscribe(
      (company: Company) => {
        this.company = company;
        console.log("Kompanija:");
        console.log(this.company);
        this.companyEquipments = this.company.equipments;
        this.getAllReservationsForCompany();
      },
      (error) => {
        console.error('Greška prilikom dobavljanja kompanije', error);
      }
    );
  }

  getAllReservationsForCompany(): void{
    if(this.loggedUser?.id){
      console.log('Id admina koji saljem u servis:');
      console.log(this.loggedUser?.id);
      this.reservationService.getAdminsAppointmentReservation(this.loggedUser.id).subscribe(
        (result: Reservation[]) => {
          this.allReservations = result;
          console.log("Sve rezervacije za adminovu kompaniju:");
          console.log(this.allReservations);
          this.getAllUsers();
        },
        (error) => {
          console.error('Greška prilikom dobavljanja kompanije', error);
        }
      );
    }
  }

  getAllUsers(): void {
    this.users = [];
    const pendingReservations = this.allReservations.filter(reservation => reservation.status === 'PENDING');
  
    for (const reservation of pendingReservations) {
      if (reservation.user) {
        this.users.push(reservation.user);
      }
    }
  
    console.log('Korisnici sa statusom PENDING rezervacija:');
    console.log(this.users);
  }
  
}
