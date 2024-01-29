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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit{
  username?: string;
  reservations: Reservation[] = []; 
  equipmentDetails: { [key: number]: string } = {};

  constructor(private route: ActivatedRoute, private resService: ReservationService,
    private equipmentService: EquipmentService,
    private itemService: ItemService,
    public userStateService: UserStateService,
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params['username'];

     this.displayUsersReservations();
    });
  }

  displayUsersReservations() {
    if (this.username) {
      this.resService.getByUser(this.username).subscribe(
        
        (reservations) => {
          console.log(this.username);
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
    // Call ItemService to get items by reservation ID
    // You might need to modify this based on your actual data structure
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
  cancelReservation(reservation: Reservation): void {
    this.reservationService.cancelReservation(reservation).subscribe(response => {
      console.log(response); // Ispisivanje odgovora sa servera
      // Ažurirajte listu rezervacija na osnovu potreba
      this.toastr.success('You have successfully cancelled your reservation!');
      this.cdr.detectChanges();
      this.displayUsersReservations();
      
    }, error => {
      console.error(error); // Ispisivanje greške ako je došlo do problema na serveru
      // Dodajte odgovarajuće korisničke poruke ili logiku rukovanja greškama
    });
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

}
