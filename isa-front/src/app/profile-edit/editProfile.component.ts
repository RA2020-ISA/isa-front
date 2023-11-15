import { Component, EventEmitter, NgModule, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../model/user-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRole } from '../model/user-role-enum';

@Component({
  selector: 'edit-Profile',
  templateUrl: './editProfile.component.html',
  styleUrls: ['./editProfile.component.css']
})

export class EditProfileComponent implements OnInit{

    username?: string;
    user?: User;

    @Output() userUpdated = new EventEmitter<null>();

    userForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required])
    })

    constructor(private route: ActivatedRoute, private userService : UserService, private router: Router) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.username = params['username'];
    
            if (this.username) {
                console.log(this.username);
    
                this.userService.getUserByUsername(this.username).subscribe((result: User) => {
                    this.user = result;
                    this.patchFormValues(); 
                });
            }
        });
    }

    SaveChanges(){
        const updatedUser: User = {
            firstName: this.userForm.value.firstName || "",
            lastName: this.userForm.value.lastName || "",
            email: '',
            password: '',
            isLocked: false,
            isEnabled: false,
            userRole: UserRole.USER,
            penaltyPoints: 0.0
        };
        if (this.user) {
            updatedUser.id = this.user.id;
          }          
          this.userService.updateUser(this.username, updatedUser).subscribe(
            (result) => {
              console.log('uspesno');
              this.user = result;
              this.userUpdated.emit();

              this.router.navigate(['/profile', this.username]);
            },
            (error) => {
                console.log(error);
            }
            );
    }

    private patchFormValues(): void {
        if (this.user?.firstName && this.user?.lastName) {
            this.userForm.patchValue({
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                email: this.username
            });
        }
    }

}
