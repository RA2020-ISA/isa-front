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
    showPasswordForm = false;
    usersPassword?: string;

    @Output() userUpdated = new EventEmitter<null>();

    userForm = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required]),
        occupation: new FormControl('', [Validators.required]),
    })

    passwordForm = new FormGroup({
        currentPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
    })

    constructor(private route: ActivatedRoute, private userService : UserService, private router: Router) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.username = params['username'];
    
            if (this.username) {
                console.log(this.username);
                
                this.userService.getUserByUsername(this.username).subscribe((result: User) => {
                    this.user = result;
                    this.usersPassword = this.user.password;
                    this.patchFormValues(); 
                });
            }
        });
    }

    togglePasswordForm() {
        this.showPasswordForm = !this.showPasswordForm;
    }

    ChangePassword() {
        if (this.passwordForm.valid) {
            if (this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword) {
                console.log('Password changed successfully!');
                alert('Password changed successfully!');
                this.showPasswordForm = false;
            } else {
                console.error('New Password and Confirm Password must match.');
                alert('New Password and Confirm Password must match.');                    
            }
            //const newPasswordValue: any = this.passwordForm.value.newPassword; // Eksplicitno određivanje tipa
            /*this.userService.validatePassword(newPasswordValue, this.username).subscribe(
                (result) => {
                    if (this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword) {
                        console.log('Password changed successfully!');
                        alert('Password changed successfully!');
                        this.showPasswordForm = false;
                    } else {
                        console.error('New Password and Confirm Password must match.');
                        alert('New Password and Confirm Password must match.');                    
                    }
                },
                (error) => {
                    console.error('Current password must match with your password.');
                    alert('Current password must match with your password.');
                }
            )
            */
        }
        else {
            console.error('Password change form is invalid.');
            alert('Password change form is invalid.');
        }
    }

    SaveChanges() {
        const updatedUser: User = {
            firstName: this.userForm.value.firstName || '',
            lastName: this.userForm.value.lastName || '',
            email: this.user?.email || '',
            password: (this.passwordForm.value.newPassword as unknown as string) || '',
            isLocked: false,
            isEnabled: false,
            userRole: UserRole.USER,
            penaltyPoints: 0.0,
            city: this.userForm.value.city || '',
            country: this.userForm.value.country || '',
            phoneNumber: this.userForm.value.phoneNumber || '',
            occupation: this.userForm.value.occupation || '',
            companyInfo: '',
        };
    
        if (this.user) {
            updatedUser.id = this.user.id;
        }
    
        this.userService.updateUser(this.username, updatedUser).subscribe(
            (result) => {
                console.log('Successfully updated user');
                this.user = result;
                this.userUpdated.emit();
                this.router.navigate(['/profile', this.username]);
            },
            (error) => {
                console.error('Error updating user', error);
            }
        );
    }

    private patchFormValues(): void {
        if (this.user?.firstName && this.user?.lastName) {
            this.userForm.patchValue({
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                email: this.username,
                city: this.user.city,
                country: this.user.country,
                phoneNumber: this.user.phoneNumber,
                occupation: this.user.occupation,
            });
            this.passwordForm.patchValue({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }

    }

}