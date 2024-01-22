import { Injectable } from '@angular/core';
import { User } from '../model/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private readonly STORAGE_KEY = 'loggedInUser';
  private loggedInUser?: User;

  constructor() {
    const storedUser = sessionStorage.getItem(this.STORAGE_KEY);
    this.loggedInUser = storedUser ? JSON.parse(storedUser) : undefined;
  }

  setLoggedInUser(user: User) {
    this.loggedInUser = user;
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  getLoggedInUser(): User | undefined {
    return this.loggedInUser;
  }

  clearLoggedInUser() {
    this.loggedInUser = undefined;
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}