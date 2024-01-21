import { Component } from '@angular/core';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-pickup-equipment',
  templateUrl: './pickup-equipment.component.html',
  styleUrls: ['./pickup-equipment.component.css']
})
export class PickupEquipmentComponent {

  selectedFile: File | null = null;
  imageUrl: string | null = null;

  constructor(private reservationService: ReservationService) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    console.log(this.selectedFile);
    if (this.selectedFile) {
      this.reservationService.readQrCodeImage(this.selectedFile)
        .subscribe((response) => {
          console.log('Ovo je procitan qr', response); // Handle the response from the server, if needed
        });
    }
  }
}
