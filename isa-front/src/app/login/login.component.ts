import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../model/user-model';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router, private userService: UserService) {
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
          // Handle disabled user error here
        } else if (this.user && this.comparePasswords(this.password, this.user.password)) {
          console.log(this.username);
          this.router.navigate(['/profile', this.username]);
        } else {
          this.wrongPassword=true;
          console.log('Invalid password');
          // Handle invalid password, for example, display an error message.
        }
      },
      (error) => {
        this.userDoesNotExist = true;
        console.log('User does not exist');
        console.log(error);
      }
    );
  }

  private comparePasswords(enteredPassword: string, storedPasswordHash: string): boolean {
    // Use bcrypt to compare the entered password with the stored hashed password
   //return bcrypt.compareSync(enteredPassword, storedPasswordHash);
   return true;
  }
}
