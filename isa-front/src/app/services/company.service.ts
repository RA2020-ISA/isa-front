// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { environment } from '../../env/environment';
import { UserStateService } from './user-state.service';
import { EquipmentAppointment } from '../model/equipment-appointment.model';
import { User } from '../model/user-model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly apiUrl = `${environment.apiHost}`;

  constructor(private http: HttpClient,
    private userStateService: UserStateService) {}

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
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });

    return this.http.post<Company>('http://localhost:8080/api/companies/create', company,  {params});
  }
  updateCompany(company : Company): Observable<Company> {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    return this.http.put<Company>('http://localhost:8080/api/companies/update/' + company.id || '', company, {params});
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
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    return this.http.post<string>('http://localhost:8080/api/companyAdmins/createAdmins/' + companyId, userIds, {params});
  }
  
  getCompanyByAdmin(adminId: number): Observable<Company>{
    return this.http.get<Company>('http://localhost:8080/api/companyAdmins/getCompanyForAdmin/' + adminId);
  }
  
  createAppointment(appointment: EquipmentAppointment): Observable<EquipmentAppointment>{
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    return this.http.post<EquipmentAppointment>('http://localhost:8080/api/appointments/create', appointment, {params});
  }

  getEquipmentById(id: number): Observable<Equipment>{
    return  this.http.get<Equipment>('http://localhost:8080/api/equipment/getById/' + id);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment>{
    return this.http.put<Equipment>('http://localhost:8080/api/equipment/update/' + equipment.id, equipment);
  }

  removeEqFromCom(companyId: number, equipmentId: number): Observable<Company>{
    return this.http.get<Company>('http://localhost:8080/api/companies/removeFrom/' + companyId + '/' + equipmentId);
  }

  addEqToCom(companyId: number, equipmentId: number): Observable<Company>{
    return this.http.get<Company>('http://localhost:8080/api/companies/addTo/' + companyId + '/' + equipmentId);
  }

  getFreeCompanyAppoinments(): Observable<EquipmentAppointment[]>{
    return this.http.get<EquipmentAppointment[]>('http://localhost:8080/api/appointments/all');
  }

  getFreeAdminsAppoinments(adminId: number): Observable<EquipmentAppointment[]>{
    return this.http.get<EquipmentAppointment[]>('http://localhost:8080/api/adminsAppointments/' + adminId);
  }

  getAdminsForCompany(companyId: number): Observable<User[]>{
    return this.http.get<User[]>('http://localhost:8080/api/companyAdmins/getAdminsForCompany/' + companyId);
  }
}