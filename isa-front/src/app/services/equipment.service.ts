// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private readonly apiUrl = `${environment.apiHost}`;

  constructor(private http: HttpClient) {}

  getAllEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>('http://localhost:8080/api/equipment/getAllEquipmentWithCompanies');
  } 

  searchEquipmentsByName(searchName: string): Observable<Equipment[]> {
    const apiUrl = 'http://localhost:8080/api/equipment/searchByName';
  
    // Pravimo objekat sa parametrima
    const searchParams = new HttpParams()
      .set('searchName', searchName || '');
  
    // Šaljemo GET zahtev sa parametrima u telu
    return this.http.get<Equipment[]>(apiUrl, { params: searchParams });
  }


}