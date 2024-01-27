import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { environment } from '../../env/environment';
import { Item } from '../model/item.model';
import { Appointment } from '../model/appointment.model';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {

  constructor(private http: HttpClient,private userStateService: UserStateService) {}
  findAvailable(items: Array<Item>): Observable<Array<Appointment>> {
    const params = new HttpParams().set('items', JSON.stringify(items));
    return this.http.post<Array<Appointment>>('http://localhost:8080/api/appointments/availableDates', null, { params });
  }
  deleteAppointment(appointmentId: number): Observable<string> {
    const url = `http://localhost:8080/api/appointments/delete/${appointmentId}`;
    return this.http.delete<string>(url);
  }

  findCompanyAppointments(companyId: number): Observable<Appointment[]> {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    return this.http.get<Appointment[]>('http://localhost:8080/api/appointments/companyAppointments/' + companyId, {params});
  }

  addAdminToAppointment(companyId: number, selectedAppointment: Appointment): Observable<Appointment> {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    return this.http.post<Appointment>('http://localhost:8080/api/appointments/addAdminToAppointment/' + companyId, selectedAppointment, {params});
  }

  updateAppointment(appointment: Appointment): Observable<Appointment>{
    return this.http.put<Appointment>('http://localhost:8080/api/appointments/update', appointment);
  }
}