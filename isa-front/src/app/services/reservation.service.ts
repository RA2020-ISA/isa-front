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
  
}