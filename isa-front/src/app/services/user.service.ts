// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { User } from '../model/user-model';

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

  /*findLoggedUser(): Observable<User>{
    return this.http.get<User>('http://localhost:8080/api/users/loggedUser');
    //return this.http.get<User>(this.apiUrl + 'users/loggedUser');
  }


  getLoginRedirectUrl(): string {
    // Adjust the URL as needed
    return 'http://localhost:8080/login';
  }
  */

  loginUser(username: string) {
    return this.http.get<number>('http://localhost:8080/api/users/userIdByUsername/' + username);
  }

  getUserByUsername(username?: string): Observable<User> {
    return this.http.get<User>('http://localhost:8080/api/users/getUserByUsername/' + username);
  }

}
