import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../model/user-model';
import { UserStateService } from '../services/user-state.service';
import { DatePipe } from "@angular/common";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  constructor(private router: Router, private userService: UserService,
     private userStateService: UserStateService, private datePipe: DatePipe,
     private toastr : ToastrService) {

  }

  username: string = '';
  password: string = '';
  userDoesNotExist: boolean = false;
  disabled: boolean = false;
  wrongPassword:boolean=false;
  user?: User;

  private isFirstDayOfMonth(date: Date): boolean {
    return date.getDate() === 1;
  }

  login() {
    this.userService.getUserByUsername(this.username).subscribe(
      (response) => {
        if(response != null){
          this.user = response;
          this.handleLogIn();
          console.log('ULOGOVAN USER NAKON PROMENE PENALTY POINTS: ', this.userStateService.getLoggedInUser())
        }
      },
      (error) => {
        this.userDoesNotExist = true;
        console.log('User does not exist');
        console.log(error);
      }
    );
  }

  handleLogIn(){
    if(this.user && this.user.userFirstLogged){

      this.showChangePassword = false;
      console.log(this.user);

      if (this.user && !this.user.enabled) {
        this.disabled = true;
      } else if (this.user && this.comparePasswords(this.password, this.user.password)) {
        this.userStateService.setLoggedInUser(this.user);
        this.router.navigate(['/homepage']);
      } else {
        this.wrongPassword=true;
      }
    }else{
      this.showChangePassword = true;
    }
  }

  private comparePasswords(enteredPassword: string, storedPassword: string): boolean {
   return enteredPassword==storedPassword;
   //return true; //izmena?
  }

  //change password:
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isPasswordNotConfirmed: boolean = false;
  showChangePassword: boolean = false;

  changePassword() {
    if ((this.newPassword != this.confirmPassword) || (this.oldPassword != this.user?.password)) {

      //if (this.newPassword != '' && this.confirmPassword != '' && this.user != null) {
        this.isPasswordNotConfirmed = true;
      //}
       
    } else {
      this.userService.updateUsersPassword(this.newPassword, this.user?.id || 0).subscribe(
        (response) => {

          this.toastr.success('Password changed successfuly! You can now log in!');
          this.showChangePassword = false;
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }
}