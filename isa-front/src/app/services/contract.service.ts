import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contract } from '../model/contract.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = 'http://localhost:8080/api/contracts'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.apiUrl);
  }

  updateContract(contractId: number, contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(this.apiUrl + '/' + contractId, contract);
  }
}