import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStateService } from './user-state.service';
import { Reservation } from '../model/reservation.model';
import { Appointment } from '../model/appointment.model';

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
    return this.http.post<Reservation>('http://localhost:8080/api/reservations/create', reservation,{params});
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

  getAdminsAppointmentReservation(adminId: number): Observable<Array<Reservation>> {
    return this.http.get<Array<Reservation>>(`http://localhost:8080/api/reservations/getAdminsAppointmentReservation/` + adminId);
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>('http://localhost:8080/api/reservations/all');
  } 

  cancelReservation(reservation: Reservation): Observable<string> {
    const url = `http://localhost:8080/api/reservations/cancel`;
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    return this.http.put(url, reservation, { responseType: 'text',params });
  }

  findReservation(reservationNumber: number): Observable<Reservation>{
    return this.http.get<Reservation>(`http://localhost:8080/api/reservations/findReservationById/`+ reservationNumber);
  }
  
  expireReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`http://localhost:8080/api/reservations/expired`, reservation);
  }

  takeOverReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`http://localhost:8080/api/reservations/takeOver`, reservation);
  }

  getCompanyAvailableAppointments(adminId: number): Observable<Array<Appointment>> {
    return this.http.get<Array<Appointment>>(`http://localhost:8080/api/appointments/companyAvailableAppointments/` + adminId);
  }

  updateReservationPrice(reservationId: number): Observable<Reservation> {
    return this.http.put<Reservation>(`http://localhost:8080/api/reservations/setPrice/`, reservationId);
  }

}