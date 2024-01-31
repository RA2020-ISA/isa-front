import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { Company } from '../model/company.model';
import { Equipment } from '../model/equipment.model';
import { environment } from '../../env/environment';
import { Item } from '../model/item.model';
import { UserStateService } from './user-state.service';
import { Reservation } from '../model/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class QRCodeService {
  private readonly apiUrl = `${environment.apiHost}`;
  private baseUrl = 'http://localhost:8080/api/qr-code';

  constructor(private http: HttpClient,private userStateService: UserStateService) {}

  getQRCodeImage(reservationId: number): Observable<ArrayBuffer> {
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    const url = `${this.baseUrl}/getQRCodeData/${reservationId}`;
    return this.http.get(url, { responseType: 'arraybuffer'  ,params});
  }

  readQrCodeImage(selectedFile: File): Observable<String>{
    const loggedInUser = this.userStateService.getLoggedInUser();
    const userParams: { [param: string]: string | number | boolean } = {
      id: loggedInUser?.id || '',
    };
    const params = new HttpParams({ fromObject: userParams });
    let formData = new FormData();
    formData.append("file", selectedFile);
    return this.http.post(`http://localhost:8080/api/qr-code/readQrCodeImage`, formData, { responseType: 'text', params });
  }
}