import { Component, OnInit } from '@angular/core';
import { AppointmentReservation } from '../model/reservation.model';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { CommonModule } from '@angular/common';
import { EquipmentService } from '../services/equipment.service';

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
    private equipmentService: EquipmentService) {}

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
}
