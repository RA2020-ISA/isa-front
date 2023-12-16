// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { environment } from '../../env/environment';
import { AppointmentReservation } from '../model/reservation.model';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {

  constructor(private http: HttpClient,private userStateService: UserStateService) {}
  createReservation(reservation: AppointmentReservation): Observable<AppointmentReservation> {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    return this.http.post<AppointmentReservation>('http://localhost:8080/api/reservations/create', reservation,{params});
  }
  getByUser(username: string): Observable<Array<AppointmentReservation>> {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    const url = `http://localhost:8080/api/reservations/byUser/${username}`;
    return this.http.get<Array<AppointmentReservation>>(url,{params});
  }
  getAllOrders(): Observable<Array<AppointmentReservation>> {
    return this.http.get<Array<AppointmentReservation>>(`http://localhost:8080/api/reservations/all`);
  }
  sendReservationQRCode(reservationId: number, recipientEmail: string): Observable<void> {
    const url = `http://localhost:8080/api/reservations/sendQrCode/${reservationId}/${recipientEmail}`;
    
    return this.http.post<void>(url, null);
  }

  addReservationToItem(itemId: number, reservationId: number): Observable<string> {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    const url = `http://localhost:8080/api/reservations/addReservationToItem/${itemId}/${reservationId}`;

    return this.http.put<string>(url, null,{params}); // Assuming you are using PUT method for addReservationToItem
  }
  
}