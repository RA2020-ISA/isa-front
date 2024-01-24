import { Component, OnInit } from '@angular/core';
import { User } from '../model/user-model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserStateService } from '../services/user-state.service';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls:[ './navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user!: User;
  
  constructor(
    private router: Router, 
    private userService: UserService, 
    public userStateService: UserStateService,
    public resService: ReservationService) {
  }

  ngOnInit():void{
  }

  userProfile(){
    this.router.navigate(['/profile']);
  }
  redirectToAllCompanies(){
    this.router.navigate(['/companies']);
  }

  redirectToCompanyForm() {
    this.router.navigate(['/company-form']);
  }

  redirectToAllEquipments(){
    this.router.navigate(['/all-equipment']);
  }
  redirectToWorkCalendar(){
    this.router.navigate(['/work-calendar']);
  }
  
  redirectToProfile(){
    const userEmail = this.userStateService.getLoggedInUser()?.email;
    console.log(this.userStateService.getLoggedInUser());
    if (userEmail) {
      this.router.navigate(['/profile', userEmail]);
    } else {
      console.error("User email is undefined");
    }
  }

  redirectToAdminCompany(){
    this.router.navigate(['/admin-company']);
  }

  redirectToManageAdmins(){
    this.router.navigate(['/manage-administrators']);
  }

  redirectToUsersReservations() {
    const username = this.userStateService.getLoggedInUser()?.email;
    if (username) {
      this.resService.getByUser(username).subscribe(
        (reservations) => {
          // Ovde možete dodati logiku za prikaz rezervacija, npr. prikazivanje na novoj stranici ili dijalogu
          console.log('Reservations:', reservations);
          this.router.navigate(['/reservations', username]);
        },
        (error) => {
          console.log('Error fetching reservations:', error);
        }
      );
    }
  }

  redirectToUsersPenaltyPoints() {
    this.router.navigate(['/users-penalty-points']);
  }

  redirectToUsersQRCodes() {
    this.router.navigate(['/users-qr-codes']);
  }

  redirectToTakeoverHistory() {
    this.router.navigate(['/users-takeover-history']);
  }

  redirectToCreateAppointment(){
    this.router.navigate(['/appointment-form']);
  }

  logout(){
    this.userStateService.clearLoggedInUser();
    this.router.navigate(['/']);
  }
  redirectToPickupEquipment(){
    this.router.navigate(['/pickup-equipment']);
  }
}
