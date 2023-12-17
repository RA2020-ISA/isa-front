import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../model/user-model';
import { HttpErrorResponse } from '@angular/common/http';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  user!: User;
  
  constructor(private router: Router, private userService: UserService, private userStateService: UserStateService) {
  }

  ngOnInit():void{
  }

  userProfile(){
    this.router.navigate(['/profile']);
  }
  redirectToAllCompanies(){
    this.router.navigate(['/companies']);
  }

  redirectToCompanyForm() {
    this.router.navigate(['/company-form']);
  }

  redirectToAllEquipments(){
    this.router.navigate(['/all-equipment']);
  }
  redirectToProfile(){
    const userEmail = this.userStateService.getLoggedInUser()?.email;
    console.log(this.userStateService.getLoggedInUser());
    if (userEmail) {
      this.router.navigate(['/profile', userEmail]);
    } else {
      console.error("User email is undefined");
    }
  }

  redirectToAdminCompany(){
    this.router.navigate(['/admin-company']);
  }

  rediretToWorkCalnedar(){
    this.router.navigate(['/work-calendar']);
  }
}