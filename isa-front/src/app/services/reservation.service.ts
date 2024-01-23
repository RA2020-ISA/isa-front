// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { environment } from '../../env/environment';
import { UserStateService } from './user-state.service';
import { Reservation } from '../model/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {

  constructor(private http: HttpClient,private userStateService: UserStateService) {}
  createReservation(reservation: Reservation): Observable<Reservation> {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    //return this.http.post<Reservation>('http://localhost:8080/api/reservations/create', reservation,{params});
    return this.http.post<Reservation>('http://localhost:8080/api/reservations/create', reservation);
  }
  getByUser(username: string): Observable<Array<Reservation>> {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    const url = `http://localhost:8080/api/reservations/byUser/${username}`;
    return this.http.get<Array<Reservation>>(url,{params});
  }

  getAllUsersReservations(username: string) {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    const url = `http://localhost:8080/api/reservations/getAllUsersReservations/${username}`;
    return this.http.get<Array<Reservation>>(url,{params});
  }

  getAllTakenUsersReservations(username: string) {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    const url = `http://localhost:8080/api/reservations/getAllTakenUsersReservations/${username}`;
    return this.http.get<Array<Reservation>>(url,{params});
  }

  getAllOrders(): Observable<Array<Reservation>> {
    return this.http.get<Array<Reservation>>(`http://localhost:8080/api/reservations/all`);
  }
  sendReservationQRCode(reservationId: number, recipientEmail: string): Observable<void> {
    const url = `http://localhost:8080/api/reservations/sendQrCode/${reservationId}/${recipientEmail}`;
    
    return this.http.post<void>(url, null);
  }

  addReservationToItem(itemId: number, reservationId: number): Observable<string> {
   
    const url = `http://localhost:8080/api/reservations/addReservationToItem/${itemId}/${reservationId}`;

    return this.http.put<string>(url, null); // Assuming you are using PUT method for addReservationToItem
  }

  getAdminsAppointmentReservation(adminId: number): Observable<Array<Reservation>> {
    return this.http.get<Array<Reservation>>(`http://localhost:8080/api/reservations/getAdminsAppointmentReservation/` + adminId);
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>('http://localhost:8080/api/reservations/all');
  } 
  cancelReservation(reservation: Reservation): Observable<string> {
    const url = `http://localhost:8080/api/reservations/cancel`;
    return this.http.put(url, reservation, { responseType: 'text' });
  }
  
}