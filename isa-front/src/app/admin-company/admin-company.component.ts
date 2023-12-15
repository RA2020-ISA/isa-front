import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';
import { Equipment } from '../model/equipment.model';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';

@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.css']
})
export class AdminCompanyComponent implements OnInit {
  company?: Company;
  equipments: Equipment[] = [];
  loggedUser?: User;

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router, private userService: UserStateService) {}

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedInUser();
    if (this.loggedUser) {
      console.log("Ulogovani korisnik je sad:");
      console.log(this.loggedUser);
      this.getAdminCompany();
    } else {
      console.log('Nije ulogovan nijedan korisnik!');
    }
  }

  getAdminCompany(): void{
    this.service.getCompanyByAdmin(this.loggedUser?.id || 0).subscribe(
      (company: Company) => {
        this.company = company;
        console.log("Kompanija:");
        console.log(this.company);
      },
      (error) => {
        console.error('Greška prilikom dobavljanja kompanije', error);
      }
    );
  }

  createAppointment(equipmentId: number): void{
    this.router.navigate(['/appointment-form/' + equipmentId]);
  }

  removeEquipment(equipment: Equipment): void{
    const index = this.company?.equipments?.indexOf(equipment);

    if (index !== undefined && this.company?.equipments) {
      this.company.equipments.splice(index, 1);
    }

    if(this.company){
      this.service.updateCompany(this.company).subscribe(
        (updatedCompany: Company) => {
          this.router.navigate(['/admin-company']);
        },
        (error) => {
          console.error('Error updating company', error);
        }
      );
    }  
  }

  addMoreEquipment(): void{

  }

  editEquipment(equipmentId: number): void{
    this.router.navigate(['/edit-equipment/' + equipmentId]);
  }
}