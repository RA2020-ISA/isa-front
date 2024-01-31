import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../services/reservation.service';
import { Reservation } from '../model/reservation.model';
import { QRCodeService } from '../services/qr-code.service';
import { User } from '../model/user-model';
import { UserStateService } from '../services/user-state.service';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-pickup-equipment',
  templateUrl: './pickup-equipment.component.html',
  styleUrls: ['./pickup-equipment.component.css']
})
export class PickupEquipmentComponent implements OnInit{

  selectedFile: File | null = null;
  imageUrl: string | null = null;
  reservation: Reservation | null = null;
  showReservation: boolean = false;
  isAbleToPickupOrder: boolean = true;
  pickUpReservations: Reservation[] = [];
  loggedUser?: User;
  company?: Company;
  futureReservation: boolean = false;

  constructor(private reservationService: ReservationService, private qrCodeService: QRCodeService,
    public userService: UserStateService, private companyService: CompanyService) { }

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
    this.companyService.getCompanyByAdmin(this.loggedUser?.id || 0).subscribe(
      (company: Company) => {
        this.company = company;
        console.log("Kompanija:");
        console.log(this.company);
        this.getAllPickUpReservations();
      },
      (error) => {
        console.error('Greška prilikom dobavljanja kompanije', error);
      }
    );
  }

  getAllPickUpReservations(): void {
    if (this.loggedUser?.id) {
      console.log('Id admina koji saljem u servis:');
      console.log(this.loggedUser?.id);
      this.reservationService.getAdminsAppointmentReservation(this.loggedUser.id).subscribe(
        (result: Reservation[]) => {
          this.pickUpReservations = result.filter(reservation =>
            reservation.status === 'PENDING' &&
            reservation.appointment?.appointmentDate &&
            new Date(reservation.appointment.appointmentDate) >= new Date()
          );
  
          console.log("Sve rezervacije za adminovu kompaniju sa statusom PENDING i budućim datumima:");
          console.log(this.pickUpReservations);
        },
        (error) => {
          console.error('Greška prilikom dobavljanja kompanije', error);
        }
      );
    }
  }
  
  

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
      this.showReservation = false;
    }
  }

  onSubmit(): void {
    console.log(this.selectedFile);
    if (this.selectedFile) {
      this.qrCodeService.readQrCodeImage(this.selectedFile)
        .subscribe((response) => {

          console.log('QR CODE: ', response);
        
          const reservationNumberMatch = response.match(/Reservation number: (\d+)/); //iz isictanog qr koda uzmi ReservationID
          
          if (reservationNumberMatch && reservationNumberMatch.length > 1) {
            const reservationNumberString = reservationNumberMatch[1];
            const reservationNumber = parseInt(reservationNumberString, 10);
            this.findUserReservation(reservationNumber);
          } else {
            console.error('Broj rezervacije nije pronađen u response stringu.');
          }
      });
    }
  }

  findUserReservation(reservationNumber: number): void{
    this.reservationService.findReservation(reservationNumber)
    .subscribe((response : Reservation) => {
       if(response != null){
          this.showReservation = true;
          this.reservation = response;
          
       }
    });
  }

  pickUpOrderAdmin(reservation: Reservation): void{
    this.reservationService.takeOverReservation(reservation) //pick_up order
          .subscribe((response : Reservation) => {
            if(response != null){
              this.pickUpReservations = this.pickUpReservations.filter(pickUpReservation => pickUpReservation.id !== reservation.id);
            }
          });
  }

  onPickupOrder(): void{     //button 
    if(this.reservation?.status?.toLocaleLowerCase().includes('taken')){
      alert('Reservacija je vec preuzeta');
    }else if(this.reservation?.status?.toLocaleLowerCase().includes('expired')){
      alert('Reservacija je vec istekla');
    }else{
      const isAbleToPickupOrder = this.checkAppointmentDateTime();
      if (this.futureReservation) {
        return;
      }
      else if(isAbleToPickupOrder){
        if (this.reservation !== null){
          this.reservationService.takeOverReservation(this.reservation) //pick_up order
          .subscribe((response : Reservation) => {
            if(response != null){
                this.showReservation = true;
                this.reservation = response;
            }
          });
        }
      }else{
        if (this.reservation !== null){
          this.reservationService.expireReservation(this.reservation) //expired
          .subscribe((response : Reservation) => {
            if(response != null){
                this.showReservation = true;
                this.reservation = response;
            }
          });
        }
      }
    }
  }

  checkAppointmentDateTime(): boolean{
    const currentDateTime: Date = new Date();
    const appointmentDate: Date = new Date(this.reservation?.appointment?.appointmentDate!!); //datum 
    const appointmentStartTime: string | undefined = this.reservation?.appointment?.appointmentTime; //14:15
    const appointmentDuration: number | undefined = this.reservation?.appointment?.appointmentDuration; //60 minutes

    if (appointmentStartTime !== undefined && appointmentDuration !== undefined) {
      const [hour, minute] = appointmentStartTime.split(':').map(Number);
      const appointmentStartDateTime = new Date(appointmentDate);
      appointmentStartDateTime.setHours(hour, minute);
      const appointmentEndDateTime = new Date(appointmentStartDateTime.getTime() + appointmentDuration * 60000);
      console.log('current time:', currentDateTime);
      console.log('start date time:', appointmentStartDateTime);
      console.log('end date time:', appointmentEndDateTime);
      if (currentDateTime >= appointmentStartDateTime && currentDateTime <= appointmentEndDateTime) {
        console.log('Termin je aktivan.');
        alert('Termin je aktivan.');
        this.isAbleToPickupOrder = true;
        this.futureReservation = false;
        return true;
      } else if (currentDateTime < appointmentStartDateTime) {
        console.log('Termin je u budućnosti.');
        alert('Ne mozete preuzeti vasu rezervaciju.');
        this.isAbleToPickupOrder = false;
        this.futureReservation = true;
        return false;
      }else {
        console.log('Termin je istekao.');
        alert('Termin je istekao.');
        this.futureReservation = false;
        this.isAbleToPickupOrder = false;
        return false;
      }
    }
    return false;
  }
}
