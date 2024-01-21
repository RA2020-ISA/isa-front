// registration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  registerSystemAdmin(userData: any): Observable<User> {
    return this.http.post<User>(this.apiUrl + 'registration/registerSystemAdmin', userData);
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


  getUserByUsername(username?: string): Observable<User> {
    return this.http.get<User>('http://localhost:8080/api/users/getUserByUsername/' + username);
  }

  updateUser(username? : string, user? : User): Observable<User> {
    return this.http.put<User>('http://localhost:8080/api/users/updateUser/' + username, user);
  }

  getUsersForCompanyAdmin(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8080/api/companyAdmins/getUsersNotInCompanyAdmin');
  }

  /*validatePassword(newPassword?: string, username?: string): Observable<boolean> {
    return this.http.get<boolean>('http://localhost:8080/api/users/validatePassword/' + newPassword + '/' + username);
  }*/

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>('http://localhost:8080/api/users/all');
  }
  //izmeni ovo na put a ne get
  //updateUsersPassword/{password}/{userId} 
  updateUsersPassword(password: string, userId: number): Observable<User> {
    return this.http.get<User>('http://localhost:8080/api/users/updateUsersPassword/' + password + '/' + userId); 
  }
}
