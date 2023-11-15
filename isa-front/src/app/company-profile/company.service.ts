// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/env/environment';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';

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
}