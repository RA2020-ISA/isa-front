// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { environment } from '../../env/environment';
import { Item } from '../model/item.model';
import { UserStateService } from './user-state.service';
import { Reservation } from '../model/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly apiUrl = `${environment.apiHost}`;

  constructor(private http: HttpClient,private userStateService: UserStateService) {}

  createItem(item: Item): Observable<Item> {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    return this.http.post<Item>('http://localhost:8080/api/item/create', item,{params});
  }
  getByReservation(id: number): Observable<Array<Item>> {
    const url = `http://localhost:8080/api/item/byReservation/${id}`;
    return this.http.get<Array<Item>>(url);
  }

  update(selectedItem: Item): Observable<Item> {
    return this.http.put<Item>('http://localhost:8080/api/item/update/' + selectedItem.id, selectedItem);
  }
  
}