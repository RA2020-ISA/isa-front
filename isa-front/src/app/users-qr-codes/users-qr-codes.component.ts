// users-qr-codes.component.ts

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserStateService } from '../services/user-state.service';
import { ReservationService } from '../services/reservation.service';
import { QRCodeService } from '../services/qr-code.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Reservation } from '../model/reservation.model';

@Component({
  selector: 'app-users-qr-codes',
  templateUrl: './users-qr-codes.component.html',
  standalone: true,  
  imports: [CommonModule],
  styleUrls: ['./users-qr-codes.component.css']
})
export class UsersQRCodesComponent implements OnInit {

  userQRCodeImages: string[] = [];
  loading: boolean = true;

  constructor(
    private userStateService: UserStateService,
    private reservationService: ReservationService,
    private qrCodeService: QRCodeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const user = this.userStateService.getLoggedInUser();

    if (user) {
      this.reservationService.getByUser(user.email).subscribe(
        (reservations) => {
          const qrCodeObservables = reservations.map(reservation => {
            return this.qrCodeService.getQRCodeImage(reservation.id || 0);
          });

          forkJoin(qrCodeObservables).subscribe(
            (imageDataList: ArrayBuffer[]) => {
              this.userQRCodeImages = imageDataList.map(imageData => this.createImageUrl(imageData));
              this.loading = false;
              console.log('USPESNO GENERISANJE QR KODA', this.userQRCodeImages);
              this.cdr.detectChanges(); // Ažuriranje UI-a
            },
            (error) => {
              console.error('Error fetching QR code images:', error);
            }
          );
        },
        (error) => {
          console.log('Error fetching reservations:', error);
        }
      );
    }
  }

  private createImageUrl(imageData: ArrayBuffer): string {
    const blob = new Blob([new Uint8Array(imageData)], { type: 'image/png' });
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
  }
}
