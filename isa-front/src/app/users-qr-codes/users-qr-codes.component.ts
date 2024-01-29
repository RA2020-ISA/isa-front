import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { UserStateService } from '../services/user-state.service';
import { ReservationService } from '../services/reservation.service';
import { QRCodeService } from '../services/qr-code.service';
import { forkJoin, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Reservation } from '../model/reservation.model';
import { ReservationStatus } from '../model/reservation-status';
import { QRCodeInfo } from '../model/qr-code.model';

@Component({
  selector: 'app-users-qr-codes',
  templateUrl: './users-qr-codes.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./users-qr-codes.component.css']
})
export class UsersQRCodesComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  filteredStatus: string | undefined | null = 'All'; 
  private subscription: Subscription = new Subscription();

  reservationStatuses: QRCodeInfo[] = [];
  userQRCodeImages: QRCodeInfo[] = [];
  filteredQRCodeImages: QRCodeInfo[] = [];

  constructor(
    public userStateService: UserStateService,
    private reservationService: ReservationService,
    private qrCodeService: QRCodeService,
    private cdr: ChangeDetectorRef
  ) { }

  private createQRCodeInfo(imageData: ArrayBuffer, status: ReservationStatus | undefined): QRCodeInfo {
    const blob = new Blob([new Uint8Array(imageData)], { type: 'image/png' });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);
    return { status, imageUrl };
  }

  ngOnInit(): void {
    const user = this.userStateService.getLoggedInUser();
    this.filteredStatus = 'All'
    this.filteredQRCodeImages = this.userQRCodeImages;

    if (user) {
      this.subscription.add(
        this.reservationService.getAllUsersReservations(user.email).subscribe(
          (reservations) => {
            const qrCodeObservables = reservations.map(reservation => {
              return this.qrCodeService.getQRCodeImage(reservation.id || 0);
            });

            forkJoin(qrCodeObservables).subscribe(
                (imageDataList: ArrayBuffer[]) => {
                  imageDataList.forEach((imageData, index) => {
                    const status = reservations[index].status;
                    const qrCodeInfo = this.createQRCodeInfo(imageData, status);
                    this.userQRCodeImages.push(qrCodeInfo);
                    this.reservationStatuses.push(qrCodeInfo);
                  });
              
                  this.loading = false;
                  console.log('USPESNO GENERISANJE QR KODA', this.userQRCodeImages);
                  this.cdr.detectChanges(); 
                },
                (error) => {
                  console.error('Error fetching QR code images:', error);
                }
            );
        }
        )
      );
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscription.unsubscribe();
  }

  private createImageUrl(imageData: ArrayBuffer): string {
    const blob = new Blob([new Uint8Array(imageData)], { type: 'image/png' });
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
  }

  filterQRCodeImages() {
    if (this.filteredStatus === 'All' || this.filteredStatus === null) {
      // If All is selected, show all QR code images
      this.filteredQRCodeImages = this.userQRCodeImages;
    } else {
      // Filter QR code images based on the selected status
      this.filteredQRCodeImages = this.userQRCodeImages.filter(qrCodeInfo => {
        return qrCodeInfo.status === this.filteredStatus;
      });
    }
  }
}
