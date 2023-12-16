// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { environment } from '../../env/environment';
import { AppointmentReservation } from '../model/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {

  constructor(private http: HttpClient) {}
  createReservation(reservation: AppointmentReservation): Observable<AppointmentReservation> {
    return this.http.post<AppointmentReservation>('http://localhost:8080/api/reservations/create', reservation);
  }
  getByUser(username: string): Observable<Array<AppointmentReservation>> {
    const url = `http://localhost:8080/api/reservations/byUser/${username}`;
    return this.http.get<Array<AppointmentReservation>>(url);
  }
  getAllOrders(): Observable<Array<AppointmentReservation>> {
    return this.http.get<Array<AppointmentReservation>>(`http://localhost:8080/api/reservations/all`);
  }
  sendReservationQRCode(reservationId: number, recipientEmail: string): Observable<void> {
    const url = `http://localhost:8080/api/reservations/sendQrCode/${reservationId}/${recipientEmail}`;
    
    return this.http.post<void>(url, null);
  }

  addReservationToItem(itemId: number, reservationId: number): Observable<string> {
    const url = `http://localhost:8080/api/reservations/addReservationToItem/${itemId}/${reservationId}`;

    return this.http.put<string>(url, null); // Assuming you are using PUT method for addReservationToItem
  }
  
}