import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../services/item.service';
import { Item } from '../model/item.model';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit {
  reservationId: number | undefined;
  items: Item[] = [];

  constructor(private route: ActivatedRoute, private itemService: ItemService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reservationId = +params['id'];
      if (this.reservationId) {
        this.loadReservationDetails();
      }
    });
  }

  loadReservationDetails(): void {
    if(this.reservationId){
      this.itemService.getByReservation(this.reservationId).subscribe(
        (items) => {
          this.items = items;
        },
        (error) => {
          console.log('Error fetching reservation details:', error);
        }
      );
    }
    
  }
}
