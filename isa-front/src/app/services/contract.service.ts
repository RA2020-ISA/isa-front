import { Delivery } from './../model/delivery.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contract } from '../model/contract.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = 'http://localhost:8080/api/contracts'; // Replace with your actual API URL
  private apiDeliveryUrl = 'http://localhost:8080/api/delivery/start'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.apiUrl);
  }

  updateContract(contractId: number, contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(this.apiUrl + '/' + contractId, contract);
  }

  startDelivery() {
    const delivery : Delivery = {
        "startLocation": [19.809378, 45.244482],
        "endLocation": [19.819489, 45.251444],
        "frequency": 1
    }
    return this.http.post(this.apiDeliveryUrl, delivery);
  }
}