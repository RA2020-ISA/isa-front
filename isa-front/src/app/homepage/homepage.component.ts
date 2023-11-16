import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../model/user-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  user!: User;
  
  constructor(private router: Router, private userService: UserService) {
  }

  ngOnInit():void{
  }

  userProfile(){
    this.router.navigate(['/profile']);
  }

}
