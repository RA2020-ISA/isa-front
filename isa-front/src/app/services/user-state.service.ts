import { Injectable } from '@angular/core';
import { User } from '../model/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private loggedInUser?: User;

  setLoggedInUser(user: User) {
    this.loggedInUser = user;
  }

  getLoggedInUser(): User | undefined {
    return this.loggedInUser;
  }

  clearLoggedInUser() {
    this.loggedInUser = undefined;
  }
}