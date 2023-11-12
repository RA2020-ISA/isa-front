// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiHost}`;

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl + 'registration', userData, {
      responseType: 'text',
    });
  }

  getLoginRedirectUrl(): string {
    // Adjust the URL as needed
    return 'http://localhost:8080/login';
  }
}
