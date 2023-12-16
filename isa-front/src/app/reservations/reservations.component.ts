import { Component, OnInit } from '@angular/core';
import { AppointmentReservation } from '../model/reservation.model';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { CommonModule } from '@angular/common';
import { EquipmentService } from '../services/equipment.service';
import { Item } from '../model/item.model';
import { ItemService } from '../services/item.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit{
  username?: string;
  reservations: AppointmentReservation[] = []; 
  equipmentDetails: { [key: number]: string } = {};

  constructor(private route: ActivatedRoute, private resService: ReservationService,
    private equipmentService: EquipmentService,
    private itemService: ItemService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params['username'];

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
    });
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
  hasReservationId(reservation: AppointmentReservation): boolean {
    return reservation.id !== undefined;
  }
}
