import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../model/user-model';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

    username?: string;
    user?: User;

    constructor(private route: ActivatedRoute, private userService : UserService) {}

    ngOnInit():void{
        this.route.params.subscribe(params => {
            this.username = params['username'];

            console.log(this.username);

            this.userService.getUserByUsername(this.username).subscribe(
                (response) =>
                {
                    this.user = response;
                    console.log(this.user);
                },
                (error) =>
                {
                    console.log('neuspesno dobavljanje celog usera na osnovu emaila');
                    console.log(error);
                }
            );
        });

    }
}
