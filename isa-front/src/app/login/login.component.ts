import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../model/user-model';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router, private userService: UserService, private userStateService: UserStateService) {
  }

  username: string = '';
  password: string = '';
  userDoesNotExist: boolean = false;
  disabled: boolean = false;
  wrongPassword:boolean=false;
  user?: User;

  login() {
    this.userService.getUserByUsername(this.username).subscribe(
      (response) => {
        this.user = response;
        console.log(this.user);

        if (this.user && !this.user.enabled) {
          this.disabled = true;
          console.log('User is disabled');
        } else if (this.user && this.comparePasswords(this.password, this.user.password)) {
          console.log(this.username);
          this.userStateService.setLoggedInUser(this.user);
          this.router.navigate(['/profile', this.username]);
        } else {
          this.wrongPassword=true;
          console.log('Invalid password');
        }
      },
      (error) => {
        this.userDoesNotExist = true;
        console.log('User does not exist');
        console.log(error);
      }
    );
  }

  private comparePasswords(enteredPassword: string, storedPassword: string): boolean {
   return enteredPassword==storedPassword;
  }
}
