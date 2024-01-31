import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { CommonModule } from '@angular/common';
import { EquipmentService } from '../services/equipment.service';
import { Item } from '../model/item.model';
import { ItemService } from '../services/item.service';
import { Observable } from 'rxjs';
import { UserStateService } from '../services/user-state.service';
import { Reservation } from '../model/reservation.model';
import { User } from '../model/user-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'users-takeover-history',
  templateUrl: './users-takeover-history.component.html',
  styleUrls: ['./users-takeover-history.component.css']
})
export class UsersTakeoverHistory implements OnInit{
    reservations: Reservation[] = []; 
    equipmentDetails: { [key: number]: string } = {};
    user: User | undefined;
    username: string | undefined;

    selectedSortOption: string = 'date';
    selectedSortOrder: string = 'asc';

    get sortedReservations(): Reservation[] {
      // Funkcija koja primenjuje sortiranje na rezervacije
      return this.sortReservations(this.reservations);
    }
  
    constructor(private route: ActivatedRoute, private resService: ReservationService,
      private itemService: ItemService,
      public userStateService: UserStateService,
      private reservationService: ReservationService,
      private cdr: ChangeDetectorRef,
      private router: Router) {}
  
    ngOnInit(): void {
        this.user = this.userStateService.getLoggedInUser();
        this.username = this.user?.email;
        this.displayUsersReservations();
    }
  
    displayUsersReservations() {
      if (this.user?.email) {
        this.resService.getAllTakenUsersReservations(this.user.email).subscribe(
          
          (reservations) => {
            console.log(this.user?.email);
            this.reservations = reservations;
            console.log('Reservations:', reservations);
          },
          (error) => {
            console.log('Error fetching reservations:', error);
          }
        );
      }
    }

    formatTime(timeString: string): string {
      if (timeString.includes(':')) {
        return timeString;
      }
  
      if (timeString.length === 2) {
        return timeString.slice(0, 2) + ':00';
      } else if (timeString.length === 3) {
        return timeString.slice(0, 2) + ':' + timeString.slice(2);
      } else {
        return timeString.slice(0, 2) + ':' + timeString.slice(2);
      }
    }
    getByReservation(reservationId: number): Observable<Array<Item>> {
      return this.itemService.getByReservation(reservationId);
    }
    resolveObservable(observable: Observable<Item[]>): Item[] {
      let items: Item[] = [];
      observable.subscribe((data) => {
        items = data;
      });
      return items;
    }
    hasReservationId(reservation: Reservation): boolean {
      return reservation.id !== undefined;
    }
    
    // Dodajte ovo u vašu komponentu
    isPastDate(appointmentDate: Date | undefined): boolean {
    if (!appointmentDate) {
      // Ako nema datuma, smatramo da nije u prošlosti
      return false;
    }
    
    const currentDate = new Date();
    const appointmentDateTime = new Date(appointmentDate);
  
    return appointmentDateTime < currentDate;
  }

  sortReservations(reservations: Reservation[]): Reservation[] {
    return reservations.sort((a, b) => {
      if (this.selectedSortOption === 'date') {
        const dateA = new Date(a.appointment?.appointmentDate || '');
        const dateB = new Date(b.appointment?.appointmentDate || '');
    
        if (dateA.getTime() !== dateB.getTime()) {
          return (this.selectedSortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime());
        } 
        else {
          const timeA = a.appointment?.appointmentTime || '';
          const timeB = b.appointment?.appointmentTime || '';
          return (this.selectedSortOrder === 'asc' ? timeA.localeCompare(timeB) : timeB.localeCompare(timeA));
        }
      }          
      else if (this.selectedSortOption === 'price') {
        const priceA = a.totalPrice || 0;
        const priceB = b.totalPrice || 0;
        return (this.selectedSortOrder === 'asc' ? priceA - priceB : priceB - priceA);
      }
      else if (this.selectedSortOption === 'duration') {
        const durationA = a.appointment?.appointmentDuration || 0;
        const durationB = b.appointment?.appointmentDuration || 0;
        return (this.selectedSortOrder === 'asc' ? durationA - durationB : durationB - durationA);
      } else {
        return 0;
      }
    });
  }

  formatDate(date: string | undefined): string {
    if (!date) {
      return '';
    }
  
    const parts = date.split('-');
    const formattedDate = parts.reverse().join('/');
    return formattedDate;
  }
  


}
  