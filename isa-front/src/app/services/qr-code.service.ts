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

  generateQRCodeSendMail(reservationId: number): Observable<string> {
    return this.http.post('http://localhost:8080/api/qr-code/generateQrCodeSendMail', reservationId, { responseType: 'text' });
  }

  getQRCodeImage(reservationId: number): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/getQRCodeData/${reservationId}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }

  readQrCodeImage(selectedFile: File): Observable<String>{
    let formData = new FormData();
    formData.append("file", selectedFile);
    return this.http.post(`http://localhost:8080/api/qr-code/readQrCodeImage`, formData, { responseType: 'text' });
  }


}