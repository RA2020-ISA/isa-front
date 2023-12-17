import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';
import { Equipment } from '../model/equipment.model';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';
import { EquipmentService } from '../services/equipment.service';
import { EquipmentAppointment } from '../model/equipment-appointment.model';
import { Location } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserRole } from '../model/user-role-enum';

@Component({
  selector: 'app-manage-administrators',
  templateUrl: './manage-administrators.component.html',
  styleUrls: ['./manage-administrators.component.css']
})
export class ManageAdministratorsComponent implements OnInit {
  users?: User[] = [];
  user?: User;

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router, private userService: UserService, private equipmentService: EquipmentService,
    private location: Location) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      (result: User[]) => {
        this.users = result;
        this.users = this.users.filter(user => user.userRole !== 'SYSTEM_ADMIN');

        console.log('All users:');
        console.log(this.users);
      },
      (error) => {
        console.error('Error in getting all users!', error);
      }
    );
  }

  makeSystemAdmin(username: string): void {
    if(this.users){
      this.userService.getUserByUsername(username).subscribe(
        (result: User) => {
          this.user = result;
    
          this.user.userRole = UserRole.SYSTEM_ADMIN; 
          this.userService.updateUser(username, this.user).subscribe(
            (updatedUser: User) => {
              console.log('User successfully updated:', updatedUser);
              if(this.users){
                const index = this.users.findIndex(u => u.email === username);
                if (index !== -1) {
                  this.users.splice(index, 1); 
                }
              }
    
            },
            (error) => {
              console.error('Error updating user!', error);
            }
          );
    
        },
        (error) => {
          console.error('Error getting user!', error);
        }
      );
    }
  }
}
