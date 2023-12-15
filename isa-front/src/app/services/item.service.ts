// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { environment } from '../../env/environment';
import { Item } from '../model/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly apiUrl = `${environment.apiHost}`;

  constructor(private http: HttpClient) {}
  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>('http://localhost:8080/api/item/create', item);
  }
  
}