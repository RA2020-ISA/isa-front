// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { environment } from '../../env/environment';
import { EquipmentAppointment } from '../model/equipment-appointment.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly apiUrl = `${environment.apiHost}`;

  constructor(private http: HttpClient) {}

  getCompany(id: number): Observable<Company> {
   // return this.http.get<Company>(this.apiUrl + 'companies/' + id);
   console.log('Api url:', this.apiUrl);
   console.log('Http:', this.http);
   return this.http.get<Company>('http://localhost:8080/api/companies/getById/' + id);
  }

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>('http://localhost:8080/api/companies/all');
  } 

  getEquipmentForCompany(id : number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>('http://localhost:8080/api/equipment/getEquipmentForCompany/' + id);
  }

  createCompany(company : Company): Observable<Company> {
    return this.http.post<Company>('http://localhost:8080/api/companies/create', company);
  }
  updateCompany(company : Company): Observable<Company> {
    return this.http.put<Company>('http://localhost:8080/api/companies/update/' + company.id || '', company);
  }

  searchCompany(searchName: string, searchLocation: string): Observable<Company[]> {
    const apiUrl = 'http://localhost:8080/api/companies/search';
  
    // Pravimo objekat sa parametrima
    const searchParams = new HttpParams()
      .set('searchName', searchName || '')
      .set('searchLocation', searchLocation || '');
  
    // Šaljemo GET zahtev sa parametrima u telu
    return this.http.get<Company[]>(apiUrl, { params: searchParams });
  }

  createCompanyAdmins(userIds: number[], companyId: number): Observable<string> {
    return this.http.post<string>('http://localhost:8080/api/companyAdmins/createAdmins/' + companyId, userIds);
  }
  
  getCompanyByAdmin(adminId: number): Observable<Company>{
    return this.http.get<Company>('http://localhost:8080/api/companies/getForAdmin/' + adminId);
  }
  
  createAppointment(appointment: EquipmentAppointment): Observable<EquipmentAppointment>{
    return this.http.post<EquipmentAppointment>('http://localhost:8080/api/appointments/create', appointment);
  }
}